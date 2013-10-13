var Alert;
(function (Alert) {
    /*
    export function message(message: string, target) {
    return build_notification( message, "", target );
    }
    */
    function success(message, target) {
        return build_notification(message, "success", target);
    }
    Alert.success = success;

    function info(message, target) {
        return build_notification(message, "info", target);
    }
    Alert.info = info;

    function warning(message, target) {
        return build_notification(message, "warning", target);
    }
    Alert.warning = warning;

    function danger(message, target) {
        return build_notification(message, "danger", target);
    }
    Alert.danger = danger;

    function build_notification(content, type, target) {
        type = type || "warning";

        var notification = document.createElement('div');
        notification.className = "alert notify-" + type;

        var message = document.createElement('span');
        message.className = "notify-message";

        if (typeof (content) == "string") {
            message.innerHTML = content;
        } else if (typeof (content) == "object" && content.nodeName) {
            message.insertBefore(content, null);
        }

        notification.insertBefore(message, null);

        if (target)
            target.insertBefore(notification, null);

        return notification;
    }
})(Alert || (Alert = {}));
