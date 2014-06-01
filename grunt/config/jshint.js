module.exports = {
	files: [ 'src/**/*.js' ],
	options: {
		strict: false,
		undef: true,
		unused: true,
		globals: {
			define: true,
			module: true,
			window: true,
			document: true,
			console: true
		}
	}
};
