'use strict';
let CollectionController = require('../collections/controller');
let Project = new CollectionController('projects');
let Tasks = new CollectionController('deliverable-tasks');
let Deliverable = new CollectionController('deliverables');
let Risks = new CollectionController('risks');
let Changes = new CollectionController('changes');

function route(app) {
	app

		.route('/dashboard/:projectId')

		.get(function* (next) {
			let projectId = parseInt( this.params.projectId, 10);
			let project = Object.assign({}, Project.read( {id: projectId}));

			delete project.statusId;
			delete project.members;
			delete project.budget;
			delete project.meta;
			delete project.$loki;
			delete project.history;

			let taskArr = Tasks.readAll({$projectId: projectId});
			let tasks = taskArr.map(function(obj) {
				// let rObj = Object.assign({}, obj);
				let rObj = {};
				rObj.id = obj.id;
				rObj.title = obj.title;
				if (obj.responsibilityMatrix.hasOwnProperty('responsible')) {
					rObj.assigned = true;
				}
				rObj.status = obj.statusId;
				rObj.startDate = obj.startDate;
				rObj.endDate = obj.endDate;
				return rObj;
			});

			let deliverables = Deliverable.readAll({$projectId: projectId});

			let budget = {
				total: 0,
				actual: 0,
				delta: 0
			};

			taskArr.forEach(task =>{
				task.activities.forEach(activity => {
					budget.total += activity.resources.budget || 0;
					budget.actual += activity.resources.total || 0;
					budget.delta += activity.resources.delta || 0;
				});
			});

			let risksArr = Risks.readAll({$projectId: projectId});
			let risks = risksArr.map(function(obj) {
				let rObj = {};
				rObj.id = obj.id;
				rObj.description = obj.description;
				rObj.status = obj.status;
				return rObj;
			});

			let changesArr = Changes.readAll({$projectId: projectId});
			let changes = changesArr.map(function(obj) {
				let rObj = {};
				rObj.id = obj.id;
				rObj.description = obj.description;
				rObj.decision = obj.decision;
				rObj.followUp = obj.followUp;
				return rObj;
			});

			this.body = {
				project: project,
				budget: budget,
				tasks: tasks,
				deliverables: deliverables,
				risks: risks,
				changes: changes
			};

			this.status = 200;
			yield next;
		});
}

module.exports = route;
