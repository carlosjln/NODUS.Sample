(function( window, undefined ) {
	var dropdown = {
		initialize: initialize
	};
	
	var dropdown_collection = [];
	
	function initialize() {
		var dropdowns = $(".dropdown");
		
		var i = dropdowns.length;
		
		while( i-- ) {
			var item = dropdowns[i];
			
			item.handle( "click", dropdown_handler );
			dropdown_collection[ dropdown_collection.length ] = item;
		}
	}
	
	function dropdown_handler(evt){
		evt.preventDefault();
		var t = this;
		
		if( t.Class("active") ) {
			t.Class("-active");
		} else {
			deactivate_all_dropdowns();
			t.Class("+active");
		}
	}

	function deactivate_all_dropdowns() {
		var i = dropdown_collection.length;
		
		while( i-- ) {
			dropdown_collection[i].Class("-active");
		}
	}
	
	function dropdown_document_handler( evt ) {
		var target = evt.target;
		if( target.Class(".dropdown") == false && target.parent(".dropdown") == null ) {
			deactivate_all_dropdowns();
		}
	}
	
	$(window.document).handle( "click", dropdown_document_handler );
	
	window.Dropdown = dropdown;
})(window);