/*eslint-disable */
var webpackConfig = require('./webpack.config');

module.exports = function(config) {
	config.set({
		browsers: [ 'Chrome' ],
		// karma only needs to know about the test bundle
		files: [
			'test/tests.bundle.js'
		],
		frameworks: [ 'chai', 'mocha', 'sinon' ],
		plugins: [
			'karma-chai',
			'karma-chrome-launcher',
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-osx-reporter',
			'karma-sinon',
			'karma-sourcemap-loader',
			'karma-webpack',
		],

		osxReporter: {
			notificationMode: 'change'
		},

		// run the bundle through the webpack and sourcemap plugins
		preprocessors: {
			'test/tests.bundle.js': [ 'webpack', 'sourcemap' ]
		},
		reporters: [ 'mocha', 'osx' ],
		singleRun: false,
		// webpack config object
		webpack: webpackConfig,
		webpackMiddleware: {
			noInfo: true
		}
	});
};
