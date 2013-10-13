var nodus;
(function (nodus) {
    /// <reference path="interfaces/AlertSettings.ts" />
    /// <reference path="../nodus.ts" />
    (function (ui) {
        var alert = (function () {
            function alert(settings) {
                this.default_options = {
                    title: null,
                    message: "",
                    type: "",
                    target: null,
                    closable: false
                };
                var options = this.settings = nodus.utils.merge(this.default_options, settings);

                var element = this.element = document.createElement('div');
                var inner = this.inner = document.createElement('span');

                var type = options.type;
                var message = options.message;
                var target = options.target;

                element.insertBefore(inner, null);
                inner.className = 'message';

                if (type)
                    element.className = "alert alert-" + type;
                if (message)
                    inner.innerHTML = message;
                if (target)
                    target.insertBefore(element, null);
            }
            alert.prototype.message = function (message) {
                this.inner.innerHTML = message;
                return this;
            };

            alert.prototype.as_success = function () {
                this.element.className = "alert-success";
                return this;
            };

            alert.prototype.as_info = function () {
                this.element.className = "alert-info";
                return this;
            };

            alert.prototype.as_warning = function () {
                this.element.className = "alert-warning";
                return this;
            };

            alert.prototype.as_danger = function () {
                this.element.className = "alert-danger";
                return this;
            };

            alert.prototype.at = function (target) {
                target.insertBefore(this.element, null);
                return this;
            };

            alert.prototype.show = function () {
                this.element.style.display = 'block';
                return this;
            };

            alert.prototype.hide = function () {
                this.element.style.display = 'none';
                return this;
            };

            alert.TYPE = {
                Success: 'success',
                Info: 'info',
                Warning: 'warning',
                Danger: 'danger'
            };
            return alert;
        })();
        ui.alert = alert;
    })(nodus.ui || (nodus.ui = {}));
    var ui = nodus.ui;
})(nodus || (nodus = {}));
/// <reference path="ui/Alert.ts" />
/// <reference path="ui/Dropdown.ts" />
/// <reference path="Definitions/jquery.d.ts" />
var nodus;
(function (nodus) {
    (function (utils) {
        function merge(target, source) {
            var result = {};

            for (var attribute in target) {
                result[attribute] = target[attribute];
            }

            for (var attribute in source) {
                result[attribute] = source[attribute];
            }

            return result;
        }
        utils.merge = merge;
    })(nodus.utils || (nodus.utils = {}));
    var utils = nodus.utils;
})(nodus || (nodus = {}));
var nodus;
(function (nodus) {
    /// <reference path="../nodus.ts" />
    /// <reference path="../Definitions/jquery.d.ts" />
    (function (ui) {
        var dropdown_collection = [];
        var opened_dropdown;

        var dropdown = (function () {
            function dropdown() {
            }
            dropdown.initialize = function (context) {
                context = context || $(window.document);

                var collection = dropdown_collection;
                var dropdowns = context.find(".dropdown");
                var dropdown;

                for (var i = 0; i < dropdowns.length; i++) {
                    dropdown = $(dropdowns[i]);
                    dropdown.find("> a").click(dropdown_click_handler);

                    if (dropdown.hasClass("open"))
                        opened_dropdown = dropdown;

                    collection[collection.length] = dropdown;
                }
            };
            return dropdown;
        })();
        ui.dropdown = dropdown;

        $(window.document).click(dropdown_document_handler);

        // HANDLERS
        // -------------------------------------------------
        function dropdown_click_handler(e) {
            e.preventDefault();

            var parent = $(this).parent();

            if (parent.hasClass("open")) {
                parent.removeClass("open");
            } else {
                open_dropdown(parent);
            }
        }

        function dropdown_document_handler(e) {
            var target = $(e.target);
            var parent = target.parents(".dropdown");

            if (target.hasClass(".dropdown") || parent.length > 0)
                return;

            close_opened_dropdown();
        }

        function open_dropdown(dropdown) {
            close_opened_dropdown();
            opened_dropdown = dropdown.addClass("open");
        }

        function close_opened_dropdown() {
            if (opened_dropdown)
                opened_dropdown.removeClass("open");
            opened_dropdown = null;
        }
    })(nodus.ui || (nodus.ui = {}));
    var ui = nodus.ui;
})(nodus || (nodus = {}));
//# sourceMappingURL=nodus.js.map
