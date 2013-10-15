var form;

var username;
var password;

var login_button;
var loading_status;
var request_status;

// var alerts;
var alert;

Handle.templates = {
	main : {
		on_success: function( template ) {
			$('body').html( template.html );
			
			var login = $('#login');
			
			login_button = login.find("button[type=submit]");
			
			form = $('form');
			form.on( 'submit', submit_handler );
			
			username = $('#username');
			password = $('#password');
			
			var Alert = nodus.ui.alert;
			alert = new Alert( { type: Alert.TYPE.Warning, target: $('#alerts').get(0) } ).hide();
			
			request_status = $('.request-status');
			
			loading_status = {
				show: function() {
					login_button.hide();
					request_status.show();
				},
				hide: function() {
					login_button.show();
					request_status.hide();
				}
			};
			
			set_focus( username );
			
			///#DEBUG
			// username.val('carlos');
			// password.val('123456');
			// login_button.trigger('click');
			///#ENDDEBUG
			
			setTimeout( function() {
				login.show();
			}, 200 );
		}
	}
};

Handle.actions = {
	authenticate_user : {
		get_params: function() {
			var password_value = password.val();
			return 'username=' + username.val() + '&password=' + (password_value ? SHA256(password_value): "");
		},
		
		on_request: on_request,
		on_success: on_success,
		timeout: 5,

		exception: exception
	}
};

Handle.exception = function( exception ) {
    console.log("BOOM! ", exception);
};

function on_request() {
	loading_status.show();
}

function on_success( resource ) {
	NODUS.process_login_resource( resource );
	
	var User = NODUS.Modules.User;
	NODUS.load_screen( User.Dashboard );
}

function exception( errors ) {
    loading_status.hide();
	
	var validation = errors.validation;
	var application = errors.application;
	var error = validation[0];
	
	if (application.length) {
		console.log( application[0].message );
		alert.message( "Ups! something went wrong. Please try again." ).show();
		return;
	}
	
	if( validation.length == 0 || error == null ) return null;
	
	alert.message( error.message ).show();
	
	set_focus( form.find( "[name="+ error.field +"]") );
}

function submit_handler( e ){
	e.preventDefault();
	login_button.trigger("click");
}