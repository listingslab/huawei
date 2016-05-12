'use strict';
let template = require('../models/charter');
let CollectionController = require('../collections/controller');
let Charter = new CollectionController('charters', template);
let Deliverables = new CollectionController('deliverables');
let Milestones = new CollectionController('milestones');

function route(app) {
	app
		.route('/projects/:id/charter')
		.get(function* (next) {
			let projectId = parseInt( this.params.id, 10 );
			let key = { $projectId: projectId };
			let charterModel = Charter.read(key);
			charterModel.deliverables = Deliverables.readAll(key);
			charterModel.milestones = Milestones.readAll(key);
			if ( !!charterModel ) {
				this.body = charterModel;
				this.status = 200;
			} else {
				this.status = 404;
				this.body = {
					error: 'charter not found'
				};
			}
			yield next;
		})
		.put(function* (next) {
			let projectId = parseInt( this.params.id, 10 );
			let reqModel = this.request.body.fields;
			let charterModel = Charter.update({ $projectId: projectId }, reqModel);
			if ( !!charterModel ) {
				this.status = 200;
				this.body = {
					success: charterModel.id
				};
			} else {
				this.status = 404;
				this.body = {
					error: 'chater not found'
				};
			}
			yield next;
		});
}

module.exports = route;
