module.exports = function ( grunt ) {

	'use strict';

	grunt.registerTask( 'build', [
		'jshint',
		'clean:tmp',
		'concat:amd',
		'concat:node',
		'concat:umd',
		'jsbeautifier',
		'concat:es6' // gets treated differently; beautifier mucks it up
	]);

};
