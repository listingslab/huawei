'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/meeting');
let Collection = new CollectionController('meeting', template);
let TopicsCollection = new CollectionController('topics');
function route(app) {
	app
		.route('/projects/:projectId/meeting')
		.get(function* (next) {
			let projectId = parseInt( this.params.projectId, 10);
			let meeting = Collection.read({ $projectId: projectId }) || template;
			meeting.topics = TopicsCollection.readAll({ $projectId: projectId });
			this.body = meeting;
			this.status = 200;
			yield next;
		})
		.put(function* (next) {
			let projectId = parseInt( this.params.projectId, 10 );
			let updates = this.request.body.fields;
			let collectionItem = Collection.read({ $projectId: projectId });
			let model = null;
			if ( !collectionItem ) {
				model = Collection.create(
					Object.assign(
						{ $projectId: projectId },
						updates || {}
					)
				);
			} else {
				model = Collection.update({$projectId: projectId}, updates);
			}

			if (!!model) {
				this.status = 200;
				this.body = {
					success: model.id
				};
			} else {
				this.status = 404;
				this.body = {
					error: 'no record found'
				};
			}
			yield next;
		})
		.delete(function* (next) {
			let projectId = parseInt( this.params.projectId, 10 );
			let model = Collection.update({$projectId: projectId}, template);
			if (!!model) {
				this.status = 200;
				this.body = {
					success: model.id
				};
			} else {
				this.status = 404;
				this.body = {
					error: 'no record found'
				};
			}
			yield next;
		});
}

module.exports = route;
