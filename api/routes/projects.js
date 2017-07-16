'use strict';
let CollectionController = require('../collections/controller');

let template = {
	title: 'New Project',
	statusId: null,
	updated: null,
	members: [],
	budget: null,
	history: {}
};

let Projects = new CollectionController('projects', template);
let now = new Date();
let setupCollections = [
	new CollectionController('charters', require('../models/charter')),
	new CollectionController('deliverables', require('../models/deliverable')),
	new CollectionController('milestones', require('../models/milestone')),
	new CollectionController('risks', require('../models/risk')),
	new CollectionController('controls', Object.assign({}, require('../models/control'), { created: now.toISOString() }) ),
	new CollectionController('changes', require('../models/changes')),
	new CollectionController('members', { role: 'stakeholder', skills: null }),
	new CollectionController('members', { role: 'core_member', skills: null })
];

let Members = new CollectionController('members');

function route(app) {
	app
		.route('/projects')
		.post(function* (next) {
			let req = this.request.body.fields;

			if (!!req && !!req.title) {
				let created = new Date();
				req.created = created.toISOString();
				req.updated = created.toISOString();
				let project = Projects.create(req);
				let projectKey = { $projectId: project.id };
				setupCollections.forEach(
					collection => collection.create(projectKey)
				);
				this.status = 200;
				this.body = {
					success: project.id
				};
			} else {
				this.status = 400;
				this.body = {
					error: 'missing params check data',
					body: req
				};
			}

			yield next;
		})
		.get(function* (next) {
			this.body = {
				items: Projects
						.readAll()
						.map(
							project =>
							{
								project.members = Members.readAll({$projectId: project.id});
								return project;
							}

						)

			};
			this.status = 200;
			yield next;
		})
		.nested('/:id')
		.get(function* (next) {
			let projectId = parseInt( this.params.id, 10 );
			let model = Projects.read({id: projectId});
			model.members = Members.readAll({$projectId: projectId});
			if ( !!model ) {
				this.body = model;
				this.status = 200;
			} else {
				this.status = 404;
				this.body = {
					error: 'no models found'
				};
			}
			yield next;
		})
		.put(function* (next) {
			let projectId = parseInt( this.params.id, 10 );
			let model = Projects.read({id: projectId});

			if ( !!model ) {
				Projects.update({id: projectId}, this.request.body.fields);
				this.body = { success: projectId };
				this.status = 200;
			} else {
				this.status = 404;
				this.body = {
					error: 'no models found'
				};
			}
		})
		.delete(function* (next) {
			let projectId = parseInt( this.params.id, 10 );
			let project = Projects.read({ id: projectId });
			if ( !!project ) {
				Projects.delete({id: projectId});
				this.body = {
					success: projectId
				};
				CollectionController.deleteAll( { $projectId: projectId } );
				this.status = 200;
				return next;
			}

			this.body = {
				error: 'project not found'
			};
			this.status = 404;
			return next;
		});
}

module.exports = route;
