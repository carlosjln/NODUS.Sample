( function( w ) {
	var $ = w.$;
	var doc = $( w.document );

	// DICTIONARIES AND COLLECTIONS
	var app_screens = {
		by_id: {},
		by_name: {}
	};

	var app_screen_actions = {};
	var app_screen_actions_method = {};
	var app_buttons_method = {};

	var app_screen_templates = {};

	var shared_context = {};
	var loaded_templates = {};

	// Main namespace
	var nodus = {
		process_login_resource: process_login_resource,

		on: on,
		load_screen: load_screen,

		get_tree_nodes: get_tree_nodes,
		
		// get_errors: parse_errors,
		// report_errors: default_exception_handler,
		
		// UI components
		Button: Button
	};

	// SETUP DOCUMENT CLICK HANDLER
	// This avoids the need to set a specific handler for each button that is rendered on the UI
	doc.click( document_click_handler );

	Button.SIZES = {
		mini: "btn-mini",
		small: "btn-small",
		regular: "btn-regular",
		large: "btn-large"
	};


	///#DEBUG
	w.NODUS = nodus;
	nodus.app_screens = app_screens;
	nodus.app_screen_actions = app_screen_actions;
	nodus.app_screen_actions_method = app_screen_actions_method;
	nodus.app_buttons_method = app_buttons_method;
	///#ENDDEBUG

	function process_login_resource( resource ) {
		var authenticated_user = resource[ resource.name ];
		var modules = authenticated_user.modules;

		delete authenticated_user.modules;

		NODUS.Modules = NODUS.get_tree_nodes( modules );
		NODUS.current_user = authenticated_user;
	}

	function on( screen ) {
		var dsl = {
			exec: function( callback ) {
				validate_screen( screen, callback );
			},

			execute_action: function( action_id, params ) {
				var callback = function() {
					execute_action( this, action_id, params );
				};

				validate_screen( screen, callback );
			}
		};

		return dsl;
	}

	function load_screen( screen, params ) {
		on( screen ).exec( function() {
			this.templates.main.render( params );
		} );
	}

	function validate_screen( screen, callback ) {
		if( screen == null ) throw new Error( "The screen parameter can't be null" );

		var typeof_screen = typeof screen;
		var screen_arg_is_string = typeof_screen == 'string';

		var screen_id = screen_arg_is_string ? screen : ( typeof_screen == 'object' && screen.id ? screen.id : null );
		var registered_screen = app_screens.by_id[ screen_id ];

		// we execute the callback early if the screen have been loaded and validated previously
		if( registered_screen ) return callback.call( registered_screen );

		var resume_on_screen = function( screen_1 ) {
			validate_screen( screen_1, callback );
		};

		// if it's a screen 
		if( screen_arg_is_string && registered_screen == null ) return request_screen_data( screen_id, resume_on_screen );

		// ensure that the handlers have been loaded prior screen usage
		if( screen[ "handlers" ] == null ) {
			return request_action_handlers( screen, resume_on_screen );
		}

		// Ensure that there's a template handler
		if( screen.handlers[ "templates" ] == null ) throw new Error( "There are no template handlers on screen '" + screen.name + "'" );

		// registering the validated screen so that it doesn't have to go through this process again
		register_screen( screen );

		callback.call( screen );
	}

	function get_tree_nodes( nodes ) {
		var container = { root: true };
		var nodes_copy = nodes.slice( 0 );

		get_child_nodes( container, nodes_copy, undefined );

		return container;
	}

	function get_child_nodes( container, nodes, parent ) {
		var i = nodes.length;
		var node;
		var array = [];

		while( i-- ) {
			node = nodes[ i ];

			if( node.parent == parent ) {
				container[ node.name ] = node;
				get_child_nodes( node, nodes, node.id );
			}
		}

		return array.length ? array.compact() : null;
	}


	// REGISTERS

	function register_screen( screen ) {
		app_screens.by_id[ screen.id ] = screen;
		app_screens.by_name[ screen.name ] = screen;

		process_screen_actions( screen );
		process_screen_templates( screen );
	}

	function register_handlers( screen, str_handlers ) {
		var handlers = {};

		try {
			new Function( "Nodus", "Share", "Screen", "Handle", str_handlers )( NODUS, shared_context, screen, handlers );
		} catch( exception ) {
			throw exception;
		}

		screen.handlers = handlers;
	}

	function process_screen_actions( screen ) {
		var actions_array = screen.actions;

		delete screen.actions;

		if( actions_array == null ) return;

		var i = actions_array.length;

		while( i-- ) {
			var action = actions_array[ i ];
			var action_id = action.id;
			var method;

			// this closure is to avoid scoping/reference issue
			( function( action_id_1 ) {
				method = function( params ) {
					on( screen ).execute_action( action_id_1, params );
				};
			} )( action_id );

			// we assign the action id into the method so that it can be identified as a screen action
			// which is used as argument in Nodus.Button( arg )
			method.id = action_id;
			screen[ action.name ] = method;

			app_screen_actions[ action_id ] = action;
			app_screen_actions_method[ action_id ] = method;
		}
	}

	function process_screen_templates( screen ) {
		var screen_id = screen.id;
		var template_array = screen.templates;

		delete screen.templates;

		if( template_array == null ) return;

		var i = template_array.length;

		var templates = screen.templates = {};

		while( i-- ) {
			var template = template_array[ i ];
			var template_id = template.id;
			var template_name = template.name;
			var render;

			// this closure is to avoid scoping reference issue
			( function( template_id_1 ) {
				render = function( params ) {
					get_template( template_id_1, params );
				};
			} )( template_id );

			template.render = render;
			templates[ template_name ] = template;

			// a new object with the template data and the screen_id is created
			// in order to leave a neat 'template' object exposed under the screen templates collection
			app_screen_templates[ template_id ] = {
				id: template_id,
				name: template_name,
				screen_id: screen_id
			};
		}
	}


	// EXPOSED BEHAVIORS
	function get_template( template_id, opt_params ) {
		var template = app_screen_templates[ template_id ];
		var screen_id = template.screen_id;
		var template_name = template.name;

		var screen = app_screens.by_id[ screen_id ];
		var handlers = screen.handlers;
		var templates = handlers.templates || {};
		var current_handler = templates[ template_name ] || { is_empty: true };
		
		var handle_application_exception = current_handler.exception || templates.exception || handlers.exception || default_exception_handler;
		
		if( current_handler.is_empty ){
			var exception = new ApplicationException( "The template '" + template_name + "' does not have a handler." );
			return handle_application_exception.call( handlers, exception );
		}

		// TEMPLATE HANDLERS
		var before_request = current_handler.before_request || function() { return true; };
		var on_request = current_handler.on_request || function() {};
		var on_action_success = current_handler.on_success || function() {
			throw new Error( "The method 'Handle.template." + template_name + ".on_success' is undefined." );
		};
		
		var continue_request = false;
		
		try {
			continue_request = before_request.call( current_handler, template );
		} catch( exception ) {
			return handle_application_exception.call( current_handler, exception );
		}

		if( continue_request ) {
			var on_success = function( response ) {
				if( has_errors( response ) ) {
					return handle_application_exception( response.errors );
				}

				var template_resource = response[ response.name ];
				var style_id = "template_" + template_resource.id;

				if( template_resource.cache ) {
					loaded_templates[ template_id ] = template_resource;
				}
				
				// Only add the template css if it does not exists
				if( $( "#" + style_id ).length == 0) {
					$('head').append('<style id="'+ style_id +'" type="text/css">'+ template_resource.css +'</style>');
				}

				// This block is executed outside this thread to avoid the scenario where on_action_success
				// has an error and the style is not being inserted (FF), added the debug wrapper so that it's removed
				// from production
				///#DEBUG
				//( function() {
				///#ENDDEBUG
					
					try {
						on_action_success.call( current_handler, template_resource, opt_params );
					} catch( on_succeess_exception ) {
						handle_application_exception.call( current_handler, new ApplicationException( on_succeess_exception ) );
					}
					
				///#DEBUG
				//} ).free();
				///#ENDDEBUG
			};

			///#DEBUG
			console.log( "Requesting template '{0}' for '{1}' screen.".format( template_name, screen.name ) );
			///#ENDDEBUG

			on_request.call( current_handler );

			var cached_template = loaded_templates[ template_id ];
			if( cached_template ) {
				return on_success( cached_template, opt_params );
			}

			var options = {
				success: on_success,
				error: handle_application_exception
			};

			request( 'screen/' + screen_id + "/template/" + template_id, null, options );
		}
	}

	function execute_action( screen, action_id, params ) {
		if( typeof( params ) != 'string' ) params = undefined;

		var handlers = screen.handlers;
		var action = app_screen_actions[ action_id ];

		var action_name = action.name;
		var action_handler = handlers.actions[ action_name ];

		if( action_handler == null ) throw new Error( "The action '" + action_name + "' is not defined on the handler." );

		var before_request = action_handler.before_request || function() { return true; };
		var get_params = action_handler.get_params || function() { return ""; };
		var on_request = action_handler.on_request || function() {};
		
		var on_action_success = action_handler.on_success || function() {
			throw new Error( "The method 'Handle.action." + action_name + ".on_success' is undefined." );
		};

		var handle_application_exception = action_handler.exception || handlers.actions.exception || handlers.exception || default_exception_handler;
		var continue_request = false;

		try {
			continue_request = before_request.call( action_handler );
		} catch( exception ) {
			return handle_application_exception.call( action_handler, exception );
		}

		if( continue_request ) {
			var on_success = function( response ) {
				///#DEBUG
				// console.log( "Executed action '{0}' with params:".format(response.get_headers()["Action"]), params );
				///#ENDDEBUG

				if( has_errors( response ) ) {
					return handle_application_exception.call( action_handler, response.errors );
				}

				try {
					on_action_success.call( action_handler, response );
				} catch( on_succeess_exception ) {
					handle_application_exception( new ApplicationException( on_succeess_exception ) );
				}
			};

			// query params will show preference on using the data provided through a direct call
			params = params || get_params.call( action_handler );
			var query_params = 'Q=' + B64( params ).encode_url();

			///#DEBUG
			console.log( "Executing action '{0}' with params:".format( action_name ), params || null );
			///#ENDDEBUG

			on_request.call( action_handler );

			var options = {
				success: on_success,
				error: handle_application_exception
			};

			request( 'action/' + action_id, query_params, options );
		}
	}


	// AJAX CALLS
	function request_action_handlers( screen, callback ) {
		///#DEBUG
		console.log( "Requesting action handlers for screen: " + screen.name );
		///#ENDDEBUG

		var options = {
			success: function( response ) {
				
				if( has_errors( response ) ) return default_exception_handler( response.errors );

				register_handlers( screen, response[ response.name ] );

				callback( screen );
			}
		};

		request( 'screen/' + screen.id + "/handlers", null, options );
	}

	function request_screen_data( screen_id, callback ) {
		///#DEBUG
		console.log( "Requesting data for screen id: " + screen_id );
		///#ENDDEBUG

		var options = {
			success: function( response ) {
				var screen = response[ response.name ];

				if( has_errors( response ) ) return default_exception_handler( response.errors );

				register_handlers( screen, response.embedded.handlers );

				return callback( screen );
			}
		};

		request( 'screen/' + screen_id, null, options );
	}

	function request( url, data, options ) {
		var handle_exception = options.exception || default_exception_handler;
		
		var request_options = {
			type: 'POST',
			dataType: "json",
			data: data,

			error: function( exception ) {
				handle_exception.call( {}, new ApplicationException( exception ) );
			}
		};
		
		jQuery.extend( request_options, options );
		
		$.ajax( url, request_options );
	}


	// BUTTON BUILDER
	function Button( settings ) {
		var screen = settings.screen;
		var params = settings.params || "";

		// -1 is used to ensure nothing is found on the templates or actions collections
		var screen_id = screen ? screen.id : -1;

		var template = app_screen_templates[ screen_id ];
		var screen_action = app_screen_actions[ screen_id ];

		var t = {};

		// copy all the properties from settings to "t" so that the settings object is not modified
		// and it could be reused by the user
		Obj.merge( t, settings );

		// just for the sake of obliterating whatever comes in the "target" attribute of the settings object
		delete t.screen;

		// set the caption from t.caption first just in case it might have been specified in the
		// settings object then it wont be overridden by the template caption or screen action caption
		t.caption = t.caption || ( template ? template.caption : null ) || ( screen_action ? screen_action.caption : null );

		var button_id = UID();
		var action_method;

		if( template ) {
			action_method = function() { get_template( template.id, params ); };
		} else if( screen_action ) {
			var method = app_screen_actions_method[ screen_id ];
			action_method = function() { method( params ); };
		} else {
			throw new Error( "Unhandled button type." );
		}

		app_buttons_method[ button_id ] = action_method;

		// if the "to_html" method needs to respond to changes made to the returned "t" object attributes then this lines
		// could go inside the "to_html" method, so far are left here for "cache" purposes
		var button = create_render_template_button( t, button_id );
		var button_html = button.html;

		t.to_html = function() {
			return button_html;
		};

		return t;
	}

	function create_render_template_button( options, button_id ) {
		button_id = button_id || UID();

		var id = options.id;
		var caption = options.caption;

		var iconset = options.iconset || '';
		var icon = options.icon;
		var size = options.size || Button.SIZES.regular;
		var type = ' ' + ( options.type || ( icon ? 'btn-icon-caption' : 'btn-caption-only' ) );

		var class_names = options.class_names || "";

		if( id ) id = ' id="' + id + '"';

		icon = icon ? '<span class="icon ' + iconset + '"><span class="' + icon + '"></span></span>' : '';
		caption = caption ? '<label>' + caption + '</label>' : '';

		if( class_names ) class_names = " " + class_names;

		var html = '<button' + id + ' data-id="' + button_id + '" class="btn screen-action ' + size + type + class_names + '">' + icon + caption + '</button>';

		return { id: button_id, html: html };
	}


	// ERROR HANDLING
	function has_errors( resource ) {
		var errors = ( resource || {} ).errors || {};

		if( errors.application && errors.application.length ) return true;
		if( errors.validation && errors.validation.length ) return true;

		return false;
	}

	function default_exception_handler( exception ) {
		// The reporting mechanics goes here
		console.log( "ApplicationException: ", exception.application[0], exception );
	}


	// DOCUMENT HANDLER
	function document_click_handler( e ) {
		var element = $( e.target );
		var button = parse_module_action( element );

		if( button ) {
			e.preventDefault();
			button.blur();
			
			var screen_id = button.data( "screen" );
			var template_id = button.data( "template" );
			var action_id = button.data( "action" );
			var params = button.data( "params" );
			var button_id = button.data( "id" );

			if( button_id ) {
				app_buttons_method[ button_id ]();

			} else if( action_id ) {
				on( screen_id ).execute_action( action_id, params );

			} else if( template_id ) {

				on( screen_id ).exec( function() {
					var template = app_screen_templates[ template_id ] || { name: null };
					var name = template.name;

					try {
						return this.templates[ name ].render( params );
					} catch( e ) {
						throw e;
					}

					throw new Error( "The template '" + template_id + "' is not registered on the templates collection." );
				} );

			} else {
				// if no action or template is specified then we assume that the desired behavior is to load the screen
				load_screen( screen_id );
			}
		}
	}

	function parse_module_action( element ) {
		var module_action_class = "screen-action";
		if( element.hasClass( module_action_class ) ) return element;

		var target_parent = element.parent( "." + module_action_class );
		if( target_parent && target_parent.hasClass( module_action_class ) ) return target_parent;

		return null;
	}


	// EXCEPTIONS
	function SystemException( exception ) {
		this.type = 'SystemException';
		this.message = exception ? exception.message : '';
		this.inner_exception = exception;
	}

	function ApplicationException( exception ) {
		exception = typeof exception == 'string' ? {message: exception} : exception;
		
		this.validation = [];
		this.application = [{
			name: 'ApplicationException',
			message: exception ? exception.message : ''
		}];
	}

} )( window );