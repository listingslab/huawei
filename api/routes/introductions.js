'use strict';

var fs = require('fs');
var readHTML = function(src) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
      if(err) return reject(err);
      resolve(data);
    });
  });
}

function route(app) {
	app
		.route('/introductions/:htmlFileName/')

		.get(function* (next) {
			let html = yield readHTML(__dirname + '/../public/html/' + this.params.htmlFileName + '.html');
			this.body = {html: html};
			this.status = 200;
			yield next;
		})

		.options(function* (next) {
			this.status = 200;
			yield next;
		});
}

module.exports = route;
