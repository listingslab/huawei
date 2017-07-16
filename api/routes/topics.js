'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/meeting-topic');
let Collection = new CollectionController('topics', template);

function route(app) {
	app
		.route('/projects/:projectId/topics')
		.post(function* (next) {
			let projectId = parseInt( this.params.projectId, 10 );
			let newModel = Collection.create(
				Object.assign(
					{ $projectId: projectId },
					this.request.body.fields || {}
				)
			);
			this.status = 200;
			this.body = {
				success: newModel.id
			};

			yield next;
		})
		.get(function* (next) {
			let projectId = parseInt( this.params.projectId, 10);
			this.body = {
				items: Collection.readAll({ $projectId: projectId })
			};
			this.status = 200;
			yield next;
		})
		.nested('/:resourceId')
		.get(function* (next) {
			let resourceId = parseInt(this.params.resourceId, 10);
			let model = Collection.read({id: resourceId});
			if (!!model) {
				this.status = 200;
				this.body = model;
			} else {
				this.status = 404;
			}

			yield next;
		})
		.put(function* (next) {
			let resourceId = parseInt(this.params.resourceId, 10);
			let updates = this.request.body.fields;
			let model = Collection.update({id: resourceId}, updates);
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
			let resourceId = parseInt(this.params.resourceId, 10);
			let model = Collection.read({id: resourceId});
			if (!!model) {
				Collection.delete({ id: resourceId });
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
		});
}

module.exports = route;
