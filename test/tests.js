(function () {

	'use strict';

	var assert, eval2;

	if ( typeof require === 'function' ) {
		assert = require( 'assert' );
		eval2 = require( '../' );
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

		it( 'should accept an array of arguments', function () {
			var fn = new eval2.Function([ 'a', 'b' ], 'return a + b;' );
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

	// difficult to test this in an automated way, but hey-ho - this
	// should behave as though we had some bona fide compiled CoffeeScript
	var coffee = [
		'answer = a + b',
		'console.log "the answer is " + answer'
	].join( '\n' );

	var js = [
		'(function() {',
		'  var answer;',
		'',
		'  answer = a + b;',
		'',
		'  console.log("the answer is " + answer);',
		'',
		'}).call(this);'
	].join( '\n' );


	var fn = eval2.Function( 'a', 'b', js, {
		sourceMap: {
			version: 3,
			sources: [ 'helloworld.coffee' ],
			sourcesContent: [ coffee ],
			names: [],
			mappings: 'AAAA;AAAA,MAAA,MAAA;;AAAA,EAAA,MAAA,GAAS,CAAA,GAAI,CAAb,CAAA;;AAAA,EACA,OAAO,CAAC,GAAR,CAAY,gBAAA,GAAmB,MAA/B,CADA,CAAA;AAAA'
		}
	});

	fn( 40, 2 );

}());

