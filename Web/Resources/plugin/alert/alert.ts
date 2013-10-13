import nodus = module("nodus");

class Alert {
    default_options = {
		title: null,
		message: "",
		closable: false
	};

    constructor( options ) {
		nodus.merge()
    }

    export function success( message: string, target ) {
        return build_notification( message, "success", target );
    }
	
    export function info( message: string, target ) {
        return build_notification( message, "info", target );
    }
	
    export function warning( message: string, target ) {
        return build_notification( message, "warning", target );
    }
	
    export function danger( message: string, target ) {
        return build_notification( message, "danger", target );
    }

    function build_notification( content, type, target ) {
        type = type || "warning";

        var notification = document.createElement('div');
        notification.className = "alert alert-" + type;

        var message = document.createElement('span');
        message.className = "notify-message";

        if (typeof (content) == "string") {
            message.innerHTML = content;
        } else if (typeof (content) == "object" && content.nodeName) {
            message.insertBefore(content, null);
        }

        notification.insertBefore(message, null);

        if (target) target.insertBefore(notification, null);

        return notification;
    }
}