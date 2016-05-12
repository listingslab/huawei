'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/milestone');
let Milestones = new CollectionController('milestones', template);

function route(app) {
	app
		.route('/projects/:projectId/milestones')
		.post(function* (next) {
			let projectId = parseInt( this.params.projectId, 10 );
			let newMilestone = Milestones.create({ $projectId: projectId });
			this.status = 200;
			this.body = {
				success: newMilestone.id
			};

			yield next;
		})
		.get(function* (next) {
			let projectId = parseInt( this.params.projectId, 10);
			this.body = {
				items: Milestones.readAll({ $projectId: projectId })
			};
			this.status = 200;
			yield next;
		})
		.nested('/:milestoneId')
		.get(function* (next) {
			let milestoneId = parseInt(this.params.milestoneId, 10);
			let deliverable = Milestones.read({id: milestoneId});
			if (!!deliverable){
				this.status = 200;
				this.body = deliverable;
			} else {
				this.status = 404;
			}

			yield next;
		})
		.put(function* (next) {
			let milestoneId = parseInt(this.params.milestoneId, 10);
			let updates = this.request.body.fields;
			let milestone = Milestones.update({id: milestoneId}, updates);
			if (!!milestone) {
				this.status = 200;
				this.body = {
					success: milestone.id
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
			let milestoneId = parseInt(this.params.milestoneId, 10);
			let milestone = Milestones.read({id: milestoneId});
			if (!!milestone) {
				Milestones.delete({id: milestoneId});
				this.status = 200;
				this.body = {
					success: milestone.id
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
