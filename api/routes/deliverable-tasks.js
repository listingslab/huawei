'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/task');
let Task = new CollectionController('deliverable-tasks', template);
let Activities = new CollectionController('deliverable-activites');

function route(app) {
	app
		.route('/projects/:projectId/deliverables/:deliverableId/tasks')
		.post(function* (next) {
			let deliverableId = parseInt(this.params.deliverableId, 10);
			let projectId = parseInt(this.params.projectId, 10);
			let newTask = Task.create({
				$projectId: projectId,
				$deliverableId: deliverableId
			});
			this.status = 200;
			this.body = {
				success: newTask.id
			};
			yield next;
		})
		.get(function* (next) {
			let deliverableId = parseInt(this.params.deliverableId, 10);
			let tasks = Task.readAll({$deliverableId: deliverableId});
			if (!tasks) {
				this.body = { error: `no tasks found` };
				this.status = 404;
			} else {
				this.body = {
					items: tasks.map(tsk => {
						tsk.activities = Activities.readAll({$taskId: tsk.id});
						return tsk;
					})
				};
				this.status = 200;
			}
			yield next;
		})
		.nested('/:taskId')
		.get(function* (next) {
			let taskId = parseInt(this.params.taskId, 10);
			let task = Task.read({id: taskId});
			if (!task) {
				this.body = { error: `no task found with id ${ taskId }` };
				this.status = 404;
			} else {
				task.activities = Activities.readAll({$taskId: taskId});
				this.body = task;
				this.status = 200;
			}
			yield next;
		})
		.put(function* (next) {
			let taskId = parseInt(this.params.taskId, 10);
			let task = Task.update({id: taskId}, this.request.body.fields);
			this.status = 200;
			this.body = {
				success: task.id
			};
			yield next;
		})
		.delete(function* (next) {
			let taskId = parseInt(this.params.taskId, 10);
			Task.delete({id: taskId});
			CollectionController.deleteAll({
				$taskId: taskId
			});
			this.status = 200;
			this.body = {
				success: taskId
			};
		});
}

module.exports = route;
