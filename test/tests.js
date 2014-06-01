(function () {

	'use strict';

	var assert, evaluate;

	if ( typeof require === 'function' ) {
		assert = require( 'assert' );
		evaluate = require( '../evaluate' );
	} else {
		assert = chai.assert;
		evaluate = window.evaluate;
	}

	describe( 'evaluate', function () {
		it( 'should evaluate a single line of code', function () {
			var result = eval2( '1 + 2' );
			assert.equal( result, 3 );
		});

		it( 'should evaluate multiple lines of code', function () {
			var result = eval2( '1 + 2; 3 + 4' );
			assert.equal( result, 7 );
		});

		it( 'should handle syntax errors in code', function () {
			try {
				eval2( 'var 42 = answer' );
			} catch ( err ) {
				assert.equal( err.name, 'SyntaxError' );
			}
		});
	});

}());

