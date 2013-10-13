if( window.console === undefined ) {
	console = {
		log: function () { }
	};
}

function set_focus( element, delay ) {
	( function(){ element.first().focus(); } ).delay(delay || 0.25);
}

var UID = (function() {
	var new_id_seed = (new Date()).getTime();

	function uid() {
		return ++new_id_seed;
	}
	
	return uid;
})();