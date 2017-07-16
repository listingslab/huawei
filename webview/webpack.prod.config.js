/* eslint-disable import/no-extraneous-dependencies */

// Initialization
const webpack = require('webpack');

// File Ops
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Folder Ops
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// PostCSS support
const postcssImport = require('postcss-easy-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

/* eslint-enable import/no-extraneous-dependencies */

// Constants
const APP = path.join(__dirname, 'src');
const BUILD = path.join(__dirname, 'build');
const DOCS = path.join(__dirname, 'docs/react-motion-demos');
const STYLE = path.join(__dirname, 'src/style.scss');
const IMAGES = path.join(__dirname, 'public/images');
const HTML = path.join(__dirname, 'public/index.html');
const NODE_MODULES = path.join(__dirname, 'node_modules');

const PACKAGE = Object.keys(
  require('./package.json').dependencies
);

module.exports = {
  // Paths and extensions
  entry: {
    app: APP,
    style: STYLE
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
  output: {
    path: BUILD,
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: APP
      },
      // Extract CSS during build
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss'),
        include: [APP, NODE_MODULES]
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss'],
        include: [APP, NODE_MODULES]
      },
      // Process JSON data fixtures
      {
        test: /\.json$/,
        loaders: ['json'],
        include: [APP, NODE_MODULES]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|otf)$/,
        loaders: ['file-loader']
      }
    ]
  },
  // Configure PostCSS plugins
  postcss: function processPostcss(webpack) {  // eslint-disable-line no-shadow
    return [
      postcssImport({
        addDependencyTo: webpack
      }),
      precss,
      autoprefixer({ browsers: ['last 2 versions'] })
    ];
  },
  // Webpack plugins
  plugins: [
    // Required to inject NODE_ENV within React app.
    // Reduntant package.json script entry does not do that, but required for .babelrc
    // Optimizes React for use in production mode
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production') // eslint-disable-line quote-props
      }
    }),
    // Clean build directory
    new CleanPlugin([BUILD]),
    new CopyWebpackPlugin([
      { from: IMAGES, to: BUILD }
    ],
      {
        ignore: ['.DS_Store', 'psd/*']
      }
    ),
    new HtmlWebpackPlugin({
      template: HTML,
      // JS placed at the bottom of the body element
      inject: 'body',
      // Use html-minifier
      minify: {
        collapseWhitespace: true
      }
    }),

    // Extract CSS to a separate file
    new ExtractTextPlugin('[name].[chunkhash].css'),

    // Remove comment to dedupe duplicating dependencies for larger projects
    new webpack.optimize.DedupePlugin(),

    // Separate vendor and manifest files
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),

    // Minify JavaScript
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // Error: vendor.450f275….js:16 Uncaught TypeError: Cannot read property 'shape' of undefined
    // Error: manifest.798b47f….js:1 Uncaught TypeError: Cannot read property 'call' of undefined
    // new webpack.optimize.OccurrenceOrderPlugin()

    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
};
