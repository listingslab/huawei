'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/activity');
let Activites = new CollectionController('deliverable-activites', template);

function parseParams(params) {
	Object.keys(params).forEach(key => params[key] = parseInt(params[key], 10));
}

function route(app) {
	app
		.route('/projects/:id/deliverables/:deliverableId/tasks/:taskId/activities')

		.post(function* (next) {
			parseParams(this.params);
			let activity = Activites.create({
				$projectId: this.params.id,
				$deliverableId: this.params.deliverableId,
				$taskId: this.params.taskId
			});
			this.body = {
				success: activity.id
			};
			yield next;
		})
		.get(function* (next) {
			parseParams(this.params);
			this.body = {
				items: Activites.readAll({ $taskId: this.params.taskId })
			};
			this.status = 200;
			yield next;
		})
		.nested('/:activityId')
		.get(function* (next) {
			parseParams(this.params);
			let activity = Activites.read({ id:  this.params.activityId });
			if (!activity) {
				this.body = { error: `no activity found with id ${ this.params.activityId }` };
				this.status = 404;
			} else {
				this.body = activity;
				this.status = 200;
			}
			yield next;
		})
		.put(function* (next) {
			parseParams(this.params);
			let activity = Activites.update({id: this.params.activityId}, this.request.body.fields);
			if (!activity) {
				this.body = { error: `no activity found with id ${ this.params.activityId }` };
				this.status = 404;
			} else {
				this.status = 200;
				this.body = {
					success: activity.id
				};
			}
			yield next;
		})
		.delete(function* (next) {
			parseParams(this.params);
			Activites.delete({id: this.params.activityId});
			this.status = 200;
			this.body = {
				success: this.params.activityId
			};
			yield next;
		});
}

module.exports = route;
