var w = window;
var doc = w.document;
var $ = w.$;
var create = $.create;

var user = NODUS.Modules.User;

Handle.templates = {
	main: {
		on_success: function( template ) {
			$("body").write_html( template.html.feed(user) );
			
			set_event_handlers();
			$(".left-sidebar a").first().trigger("click");
		}
	}
};

Handle.logout = {
	on_success: function() {
		
	}
};


function set_event_handlers() {
	var active_tab;
	var active_tab_content;
	var main_container = $('.main-container').first();
	var elements = $(".left-sidebar .action-bar a");
	var i = elements.length;
	var TAB = {};
	
	var handler = function( e ) {
		e.preventDefault();
		e.cancel();
		
		var element = this;
		var li = element.parent("li");
		
		var tab_name = element.attr("tab-name");
		var screen_id = element.attr("data-screen");
		var tab = TAB[ tab_name ] = TAB[ tab_name ] || {};

		var tab_content = tab.content;
		
		if( tab_content ) return activate_tab( li, tab_content );
		
		// CREATE THE TAB CONTENT
		tab_content = tab.content = create( '<div class="content tab-content '+ tab_name +'"><span class="request-status">Loading...</span>' ).first();
		main_container.insert( tab_content );
		
		activate_tab( li, tab_content );
		
		NODUS.load_screen( screen_id, tab_content );
	};
	
	while(i--) {
		elements[i].handle('click', handler );
	}
	
	function activate_tab( tab, container ) {
		if( active_tab ) active_tab.Class("-active-tab");
		active_tab = tab.Class("+active-tab");

		if( active_tab_content ) active_tab_content.Class( "-active-container" );
		active_tab_content = container.Class( "+active-container" );
	}
}