'use strict';
let CollectionController = require('../collections/controller');

let template = {
	role: null,
	skills: null
};

let Members = new CollectionController('members', template);

function route(app) {
	app
		.route('/projects/:pid/members')
		.post(function* (next) {
			let projectId = parseInt(this.params.pid, 10);
			let newMember = Members.create(
				Object.assign(
					{ $projectId: projectId },
					this.request.body.fields || {}
				)
			);
			this.status = 200;
			this.body = {
				success: newMember.id
			};
			yield next;
		})
		.get(function* (next) {
			let projectId = parseInt(this.params.pid, 10);
			this.body = {
				items: Members.readAll({ $projectId: projectId })
			};
			this.status = 200;
			yield next;
		})

		.nested('/:id')
		.get(function* (next) {
			let id = parseInt(this.params.id, 10);
			this.body = Members.read({id: id});
			this.status = 200;
			yield next;
		})
		.put(function* (next) {
			let memeberId = parseInt(this.params.id, 10);
			let member = Members.update(
				{ id: memeberId },
				this.request.body.fields
			);

			if ( !!member ) {
				this.status = 200;
				this.body = {
					success: member.id
				};
			} else {
				this.status = 404;
			}

			yield next;
		})
		.delete(function* (next) {
			let id = parseInt(this.params.id, 10);
			let member = Members.read({id: id});
			if (member) {
				Members.delete({id: id});
				this.status = 200;
			} else {
				this.status = 404;
			}
			yield next;
		});
}

module.exports = route;
