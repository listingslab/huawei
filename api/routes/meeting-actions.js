'use strict';
let template = require('../models/meeting-action');
let CollectionController = require('../collections/controller');
let Actions = new CollectionController('meeting-actions', template);

function route(app) {
	// Actions endpoint
	app
		.route('/project/:projectId/meetings/:meetingId/actions')
		.post(function* (next) {
			let meetingId = parseInt(this.params.meetingId, 10);
			let projectId = parseInt(this.params.projectId, 10);

			let newAction = Actions.create({
				$meetingId: meetingId,
				$projectId: projectId
			});

			this.status = 200;
			this.body = {
				success: newAction.id
			};
			yield next;
		})
		.get(function* (next) {
			let meetingId = parseInt(this.params.meetingId, 10);
			let actions = Actions.readAll({ $meetingId: meetingId });
			this.body = {
				items: actions
			};
			this.status = 200;
			yield next;
		})
		.nested('/:actionId')
		.get(function* (next) {
			let actionId = parseInt(this.params.actionId, 10);
			let action = Actions.read({ id: actionId });
			this.body = action;
			this.status = !!action ? 200 : 404;
			yield next;
		})
		.put(function* (next) {
			let self = this;
			let actionId = parseInt(this.params.actionId, 10);
			let reqModel = this.request.body.fields;
			let whitelist = {
				action: true,
				time: true,
				responsibleId: true
			};

			Object.keys(reqModel).forEach(key=>{
				if (!(key in whitelist)) {
					delete reqModel[key];
				}
			});

			let action = Actions.update({id: actionId}, reqModel);

			if (!!action) {
				this.status = 200;
				this.body = {
					success: action.id
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
