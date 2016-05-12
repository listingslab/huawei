"use strict";

function route(app, db) {
	app
		.route('/glossarise')
		
		.get(function* (next) {

			var collection = db.getCollection('content');
			var introduction = collection.find({type: 'introduction'});
			var introductionArr = [];
			for (var i=0; i<introduction.length; i++){
				introductionArr.push ({
					title: introduction[i].title,
					slug: introduction[i].slug
				})
			}
			var glossary = collection.find({type: 'glossary'});
			var glossaryArr = [];
			for (var i=0; i<glossary.length; i++){
				glossaryArr.push (glossary[i].title)
			}
			this.body = {
				glossarys: glossaryArr,
				introductions: introductionArr
			};
			this.status = 200;
			yield next;
		})

		.all(function* (next) {
			this.status = 404;
			this.body = {
				response: 'Not Found'
			}
			yield next;
		})
		
}

module.exports = route;
