'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/deliverable');
let Deliverable = new CollectionController('deliverables', template);
let Tasks = new CollectionController('deliverable-tasks');
let Activites = new CollectionController('deliverable-activites');

function route(app) {
	app
		.route('/projects/:id/deliverables')
		.post(function* (next) {
			let projectId = parseInt(this.params.id, 10);
			let newDeliverable = Deliverable.create({$projectId: projectId});
			this.status = 200;
			this.body = {
				success: newDeliverable.id
			};
			yield next;
		})
		.get(function* (next) {
			let projectId = parseInt(this.params.id, 10);
			let deliverables = Deliverable.readAll({ $projectId: projectId });
			this.body = {
				items: deliverables.map(del => {
					del.tasks = Tasks.readAll({
						$deliverableId: del.id
					}).map( task => {
						task.activities = Activites.readAll({$taskId: task.id });
						return task;
					});

					return del;
				})
			};
			this.status = 200;
			yield next;
		})
		.nested('/:deliverableId')
		.get(function* (next) {
			let id = parseInt(this.params.deliverableId, 10);
			let deliverable = Deliverable.read({id: id});
			if (!!deliverable) {
				deliverable.tasks = Tasks
					.readAll({ $deliverableId: id })
					.map( task => {
						task.activities = Activites.readAll({$taskId: task.id });
						return task;
					});
				this.status = 200;
				this.body = deliverable;
			} else {
				this.status = 404;
			}

			yield next;
		})
		.put(function* (next) {
			let updates = this.request.body.fields;
			let id = parseInt( this.params.deliverableId, 10);
			let deliverable = Deliverable.update({id: id}, updates);

			if (deliverable) {
				this.status = 200;
				this.body = {
					success: deliverable.id
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
			let id = parseInt( this.params.deliverableId, 10 );
			Deliverable.delete({ id: id });
			CollectionController.deleteAll({$deliverableId: id});
			this.status = 200;
			this.body = {
				success: id
			};
		});
}

module.exports = route;
