/*eslint-disable */

var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var node_modules = path.resolve(__dirname, 'node_modules');

var PROD_ENV = process.env.NODE_ENV === 'production';
var DEV_ENV = process.env.NODE_ENV === 'development';

var entry = {
	app: [path.resolve(__dirname, 'app/index.js')]
}

if (DEV_ENV) {
	entry.app.push('webpack/hot/dev-server');
}


console.log(process.env.NODE_ENV);

module.exports = {
	context: path.resolve(__dirname, 'app'),
	entry: entry,
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: 'bundle.js'
	},
	devtool: DEV_ENV && 'eval-source-map',
	module: {
		loaders: [
			{
				test: /\.spec\.js|\.jsx?$/,
				loaders: ['react-hot-loader','babel-loader?stage=0'],
				include: path.join(__dirname, 'app')
			},
			{ test: /node_modules[\/|\\].*\.css$/, loaders: [
				'style-loader?singleton',
				'css-loader',
				'cssnext-loader'
			]},
			{ test: /[\/|\\]app[\/|\\].*\.css$/, loaders: [
				'style-loader?singleton',
				'css-loader?modules&localIdentName=[path]--[local]',
				'cssnext-loader'
			]},
			{ test: /\.(png|jpg|gif|svg)/, loader: 'url-loader?limit=2500' },
			{ test: /\.(eot|woff|woff2|ttf|mp3|ogg)/, loader: 'url-loader?limit=100000' },
			{ test: /\.(json)/, loader: 'json-loader' },
			{ test: /\.csv/, loader: 'dsv-loader' }
		],
		noParse: [
			path.resolve(node_modules, 'react/dist/react.min.js'),
			path.resolve(node_modules, 'sinon/lib/sinon.js')
		]
	},
	cssnext: {
		browsers: 'last 2 versions',
		plugins: [
			require('postcss-nested')
		],
		features: {
			customProperties: {
				variables: require('./app/css/_vars'),
				appendVariables: true
			},
			customMedia: {
				extensions: require('./app/css/_media'),
				preserve: true,
				appendExtensions: true
			}
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			__DEV__: DEV_ENV
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
	],
	resolve: {
		modulesDirectories: ['node_modules', 'app'],
		extensions: ['', '.js', '.jsx']
	},
	externals: {
		electron: 'commonjs electron'
	},
	devServer: {
		proxy: {
			'/img/*': 'http://localhost:3000',
			'/charts/*': 'http://localhost:3000',
			'/dashboard/*': 'http://localhost:3000'
		}
	}
};
