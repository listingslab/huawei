require('babel-core/polyfill');

var context = require.context('../app', true, /.+\.spec\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
