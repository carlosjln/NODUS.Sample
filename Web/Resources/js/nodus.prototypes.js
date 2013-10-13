( function() {
	// STRING PROTOTYPES
	// -----------------------------------------------------------
	String.prototype.to_function = function() {
		return new Function( 'A', 'B', 'C', 'D', 'E', this );
	};

	String.prototype.to_json = function() {
		return ( 'return (' + this + ')' ).to_function()();
	};

	String.prototype.to_dom = function() {
		return $( "" + this );
	};

	String.prototype.format = function() {
		var params = arguments;
		var str = this;

		str = str.replace( /{([0-9]*)}/ig, function( match, item ) {
			return params[ item ] || "";
		} );

		return "" + str;
	};

	String.prototype.encode_ent = function( r ) {
		return this.replace( /./g,
			function( s ) {
				var i = s.charCodeAt( 0 );
				if( ( ( r ) ? ( i != 34 && i != 39 && i != 38 && i != 60 && i != 62 ) : 1 ) && ( ( i > 31 && i < 96 ) || ( i > 96 && i < 127 ) ) ) {
					return s;
				} else {
					return '&#' + i + ';';
				}
			}
		);
	};

	String.prototype.decode_ent = function() {
		return this.replace( /&#(\d)+;/g,
			function( s, d, f ) {
				s = String.fromCharCode( s.replace( /[#&;]/g, '' ) );
				return s;
			}
		);
	};

	String.prototype.encode_url = function() {
		return encodeURIComponent( this );
	};

	String.prototype.decode_url = function() {
		return decodeURIComponent( this );
	};


	// ARRAY PROTOTYPES
	// -----------------------------------------------------------
	Array.prototype.add = function( obj ) {
		this[ this.length ] = obj;
	};


	// FUNCTION PROTOTYPES
	// -----------------------------------------------------------
	Function.prototype.delay = function( time, args, context ) {
		var t = this;
		var type = jQuery.type;

		if( type( args ) == "object" ) {
			context = args;
			args = [];
		}

		context = type( context ) == "object" ? context : null;
		args = type( args ) == "array" ? args : [args];

		return setTimeout(
			function() {
				return t.apply( context, args );
			}, time * 1000
		);
	};	

	
} )();