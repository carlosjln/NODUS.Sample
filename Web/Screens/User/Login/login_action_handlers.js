var form;

var username;
var password;

var login_button;
var loading_status;

Handle.templates = {
	main : {
		on_success: function( template ) {
			$('body').html( template.html );
			
			var login = $('#login');
			login_button = login.find(".login-authenticate-user");
			
			form = $('form');
			form.on( 'submit', form_handler );
		
			username = $('#username');
			password = $('#password');
			
			var action_buttons = $('#action-buttons');
			var status = $('.notify-request-status').first();
			
			loading_status = {
				show: function() {
					action_buttons.hide();
					status.show();
				},
				hide: function() {
					action_buttons.show();
					status.hide();
				}
			};
			
			set_focus( username );
			
			///#DEBUG
			username.value = 'carlos';
			password.value = '123456';
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
			var password_value = password.value;
			return 'username=' + username.value + '&password=' + (password_value ? SHA256(password_value): "");
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
	
	if (application.length) return display_appication_error();
	
	if( validation.length == 0 || error == null ) return null;
	
	display_validation_error( error.message );
	
	set_focus( "#"+error.field );
}

function form_handler( e ){
	e.preventDefault();
	login_button.trigger("click");
}

function display_validation_error( message ) {
	var notification = $( Notify.warning( message ) ).css("text-align: center");
	$('#display-validation-errors').empty().insert( notification );
}

function display_appication_error() {
    var message = 'Usuario o contraseña incorrecta.';
    var notification = $( Notify.warning(message)).css("text-align: center");
    $('#display-application-erros').empty().insert(notification);
}