(function ( global ) {

	'use strict';

	var _eval, isBrowser, isNode, head, Module;

	if ( typeof define === 'function' && define.amd ) {
		define( function () { return eval2; });
	} else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = eval2;
	} else {
		global.eval2 = eval2;
	}

	// This causes code to be eval'd in the global scope
	_eval = eval;

	if ( typeof document !== 'undefined' ) {
		isBrowser = true;
		head = document.getElementsByTagName( 'head' )[0];
	} else if ( typeof module !== 'undefined' && typeof module.constructor === 'function' ) {
		isNode = true;
		Module = module.constructor;
	} else {
		throw new Error( 'eval2: unknown environment. Please raise an issue at https://github.com/Rich-Harris/eval2/issues. Thanks!' );
	}

	function eval2 ( script, options ) {
		options = ( typeof options === 'function' ? { callback: options } : options || {} );

		if ( options.sourceURL ) {
			script += '\n//# sourceURL=' + options.sourceURL;
		}

		try {
			return _eval( script );
		} catch ( err ) {
			// If the script contains a SyntaxError, use the data URI
			// method to locate it
			if ( err.name === 'SyntaxError' ) {
				if ( isBrowser ) {
					locateErrorUsingDataUri( script );
				} else {
					locateErrorUsingModule( script, options.sourceURL || '' );
				}
			}

			throw err;
		}
	}

	function locateErrorUsingDataUri ( code ) {
		var dataURI, scriptElement;

		dataURI = 'data:text/javascript;charset=utf-8,' + encodeURIComponent( code );

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
			m._compile( '\n' + code, url );
		} catch ( err ) {
			console.error( err );
		}
	}

}( typeof window !== 'undefined' ? window : this ));
