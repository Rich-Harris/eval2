(function () {

	'use strict';

	var assert, eval2;

	if ( typeof require === 'function' ) {
		assert = require( 'assert' );
		eval2 = require( '../eval2' );
	} else {
		assert = chai.assert;
		eval2 = window.eval2;
	}

	describe( 'eval2', function () {
		it( 'should evaluate a single line of code', function () {
			var result = eval2( '1 + 2' );
			assert.equal( result, 3 );
		});

		it( 'should evaluate multiple lines of code', function () {
			var result = eval2( '1 + 2; 3 + 4' );
			assert.equal( result, 7 );
		});

		it( 'should locate syntax errors in code', function () {
			try {
				eval2( 'var 42 = answer' );
			} catch ( err ) {
				assert.equal( err.name, 'SyntaxError' );
			}
		});
	});

	describe( 'eval2.Function', function () {
		it( 'should create a function', function () {
			var fn = new eval2.Function( 'a', 'b', 'return a + b;' );
			assert.ok( typeof fn === 'function' );
			assert.equal( fn( 40, 2 ), 42 );
		});

		it( 'does not require the new operator', function () {
			var fn = eval2.Function( 'a', 'b', 'return a + b;' );
			assert.ok( typeof fn === 'function' );
			assert.equal( fn( 40, 2 ), 42 );
		});

		it( 'should locate syntax errors', function () {
			try {
				var fn = new eval2.Function( 'a', 'b', 'return a _ b;' );
			} catch ( err ) {
				assert.equal( err.name, 'SyntaxError' );
			}
		});
	});

}());

