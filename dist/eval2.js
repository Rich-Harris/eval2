(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.eval2 = factory()
}(this, function () { 'use strict';

	var _eval, isBrowser, isNode, head, Module, base64Encode;

	var SOURCE_MAPPING_URL = 'sourceMappingUrl';
	var DATA = 'data';

	// This causes code to be eval'd in the global scope
	_eval = eval;

	if ( typeof document !== 'undefined' ) {
		isBrowser = true;
		head = document.getElementsByTagName( 'head' )[0];
	} else if ( typeof process !== 'undefined' ) {
		isNode = true;
		Module = ( require.nodeRequire || require )( 'module' );
	}

	if ( typeof btoa === 'function' ) {
		base64Encode = function ( str ) {
			str = str.replace( /[^\x00-\x7F]/g, function ( char ) {
				var hex = char.charCodeAt( 0 ).toString( 16 );
				while ( hex.length < 4 ) hex = '0' + hex;

				return '\\u' + hex;
			});

			return btoa( str );
		};
	} else if ( typeof Buffer === 'function' ) {
		base64Encode = function ( str ) {
			return new Buffer( str, 'utf-8' ).toString( 'base64' );
		};
	} else {
		base64Encode = function () {};
	}

	function eval2 ( script, options ) {
		options = options || {};

		if ( options.sourceMap ) {
			script += '\n//# ' + SOURCE_MAPPING_URL + '=data:application/json;charset=utf-8;base64,' + base64Encode( JSON.stringify( options.sourceMap ) );
		}

		else if ( options.sourceURL ) {
			script += '\n//# sourceURL=' + options.sourceURL;
		}

		try {
			return _eval( script );
		} catch ( err ) {
			if ( isNode ) {
				locateErrorUsingModule( script, options.sourceURL || '' );
				return;
			}

			// In browsers, only locate syntax errors. Other errors can
			// be located via the console in the normal fashion
			else if ( isBrowser && err.name === 'SyntaxError' ) {
				locateErrorUsingDataUri( script );
			}

			throw err;
		}
	}

	eval2.Function = function () {
		var i, args = [], body, wrapped, options;

		i = arguments.length;
		while ( i-- ) {
			args[i] = arguments[i];
		}

		if ( typeof args[ args.length - 1 ] === 'object' ) {
			options = args.pop();
		} else {
			options = {};
		}

		// allow an array of arguments to be passed
		if ( args.length === 1 && Object.prototype.toString.call( args ) === '[object Array]' ) {
			args = args[0];
		}

		if ( options.sourceMap ) {
			options.sourceMap = clone( options.sourceMap );

			// shift everything a line down, to accommodate `(function (...) {`
			options.sourceMap.mappings = ';' + options.sourceMap.mappings;
		}


		body = args.pop();
		wrapped = '(function (' + args.join( ', ' ) + ') {\n' + body + '\n})';

		return eval2( wrapped, options );
	};

	function locateErrorUsingDataUri ( code ) {
		var dataURI, scriptElement;

		dataURI = DATA + ':text/javascript;charset=utf-8,' + encodeURIComponent( code );

		scriptElement = document.createElement( 'script' );
		scriptElement.src = dataURI;

		scriptElement.onload = function () {
			head.removeChild( scriptElement );
		};

		head.appendChild( scriptElement );
	}

	function locateErrorUsingModule ( code, url ) {
		var m = new Module();

		try {
			m._compile( 'module.exports = function () {\n' + code + '\n};', url );
		} catch ( err ) {
			console.error( err );
			return;
		}

		m.exports();
	}

	function clone ( obj ) {
		var cloned = {}, key;

		for ( key in obj ) {
			if ( obj.hasOwnProperty( key ) ) {
				cloned[ key ] = obj[ key ];
			}
		}

		return cloned;
	}

	return eval2;

}));