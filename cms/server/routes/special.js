"use strict";

function route(app, db) {
	app

		.route('/special/:slug')
		
		.get(function* (next) {
			var content = db.getCollection('content');
			var data = content.find ({type:'guide'});
			content.removeWhere ({type:'guide'});
			db.saveDatabase();
			this.body = {
				description: 'Do special stuff',
				data:data
			};
			this.status = 200;
			yield next;
		})
}

module.exports = route;
