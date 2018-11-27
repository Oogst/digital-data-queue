var WebpackClosureCompiler = require('webpack-closure-compiler');
var webpack = require('webpack');

module.exports = {
	'entry': {
		'bundle': './src/digital-data-queue.js'
	},
	'output': {
		'path': __dirname + "/dist",
		'filename': "ddq.min.js"
	},
	'plugins': [
		new WebpackClosureCompiler({
			compiler: {
				language_in: 'ECMASCRIPT6', 
				language_out: 'ECMASCRIPT5',
				compilation_level: 'SIMPLE_OPTIMIZATIONS'
			},
			concurrency: 3,
		})
	]
};