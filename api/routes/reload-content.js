'use strict';

/*	Reloads the content Loki database
*/

function route(app, content) {
	app
		.route('/reload-content')

		.get(function* (next) {
			content.loadDatabase({}, () => {});
			console.log('Content Reloaded');
			this.body =  {reloaded:true};
			this.status = 200;
			yield next;
		})
}

module.exports = route;
