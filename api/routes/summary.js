'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/summary');
let Collection = new CollectionController('summary', template);

function route(app) {
	app
		.route('/projects/:projectId/summary')
		.get(function* (next) {
			let projectId = parseInt( this.params.projectId, 10);
			this.body = Collection.read({ $projectId: projectId }) || template;
			this.status = 200;
			yield next;
		})
		.put(function* (next) {
			let projectId = parseInt( this.params.projectId, 10 );
			let updates = this.request.body.fields;
			let summary = Collection.read({ $projectId: projectId });
			let model = null;
			if ( !summary ) {
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
