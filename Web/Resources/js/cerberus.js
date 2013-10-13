( function(window, $) {
	var modules = {};
	
	// Initialize
	setup_prototypes();
	define_modules();
	set_event_handlers();

	function setup_prototypes() {
		String.prototype.to_function = function() {
            return new Function('A', 'B', 'C', 'D', 'E', this);
        };
		
		String.prototype.to_json = function() {
			return ('return (' + this + ')').to_function()();
		};
		
		String.prototype.to_dom = function() {
			return $(' ' + this);
		};
		
		$.fn.highlight = function() {
			var color = [255, 249, 177].join(',') + ',',
				transparency = 1,
				element = this[0],
				timeout = setInterval(function(){
					if(transparency >= 0){
						element.style.backgroundColor = 'rgba(' + color + (transparency -= 0.015) + ')';
					} else {
						clearInterval(timeout);
					}
				}, 40);
			return this;
		};
	}

	function define_modules() {
		var kb = modules.kb = {};
		var grid = kb.grid = {};
		
		grid.reload = function() {
			
		};
	}

	function set_event_handlers() {
		// TODO: Import or create a tab componet, so that the tab handling is cleaner
		var active_tab;
		var active_tab_container;
		
		var tabs = $(".left-panel .tabs a");
		var clearfix = $(".right-panel .content .clearfix");
		
		tabs.on("click", function( evt ) {
			evt.preventDefault();
			
			var tab = $(this);
			var li = tab.parent("li");
			
			var tab_name = tab.attr("tab-name");
			var tab_container_id = tab.attr("tab-container-id");
			var tab_container = $("#" + tab_container_id );
			
			if( tab_container.length ) return activate_tab( li, tab_container );
			
			tab_container = $( '<div id="'+ tab_container_id +'" class="tab-container active-tab"><span class="request-status">Loading...</span>' );
			activate_tab( li, tab_container );
			
			$.ajax({
				url: "/api/view/" + tab_name,
				complete: function( response ) {
					var response_text = response.responseText;
					var json = response_text.to_json();
					
					var html = tab_container.html( json.html + '<div class="clearfix"></div>' );
					
					html.insertBefore( clearfix );
					
					new Function( "container", json.js )( tab_container );
				}
			});
		});
		
		// TODO: REMOVE
		///#DEBUG
		tabs.get(1).click();
		///#ENDDEBUG
		
		function activate_tab( tab, container ) {
			if( active_tab ) active_tab.removeClass("active-tab");
			active_tab = tab.addClass("active-tab");

			if( active_tab_container ) active_tab_container.removeClass( "active-tab" );
			active_tab_container = container.addClass( "active-tab" );
		}
	}
	
	function Overlay( content, optional_container ) {
		var modal_container = $('<div class="modal-container">');
		var modal_overlay = $('<div class="modal-overlay">');
		var modal_content = $( content ).addClass("modal-content");

		modal_container.append( modal_overlay, modal_content );
		
		var btn_hide = modal_container.find(".btn-hide");
		btn_hide.click( {container: modal_container}, function( evt ){
			evt.data.container.hide();
		} );
		
		var btn_remove = modal_container.find(".btn-remove");
		btn_remove.click( {container: modal_container}, function( evt ){
			evt.data.container.remove();
		} );
		
		modal_container.keyup( {btn_close: (btn_remove||btn_hide)}, function( e ) {
			if( e.keyCode == 27 ) e.data.btn_close.click();
		} );
		
		(optional_container || $("body")).append( modal_container );

		var margin_top = modal_content.height() / 2;
		var margin_left = modal_content.width() / 2;
		
		modal_content.css( "margin", "-" + margin_top + "px 0 0 -" + margin_left + "px" );
		
		return modal_container;
	}

	var cerberus = {
		modules: modules
	};
	
	window.Overlay = Overlay;
	window.Cerberus = cerberus;
	
})(window, $);