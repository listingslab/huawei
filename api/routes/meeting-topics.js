'use strict';
let template = require('../models/meeting-topic');
let CollectionController = require('../collections/controller');
let Topics = new CollectionController('meeting-topics', template);

function route(app) {

	app
		.route('/projects/:projectId/meetings/:meetingId/topics')
		.get(function* (next) {
			let meetingId = parseInt(this.params.meetingId, 10);
			this.body = {
				items: Topics.readAll({ $meetingId: meetingId })
			};
			this.status = 200;
			yield next;
		})
		.post(function* (next) {
			let projectId = parseInt(this.params.projectId, 10);
			let meetingId = parseInt(this.params.meetingId, 10);
			let topic = Topics.create({ $projectId: projectId, $meetingId: meetingId });
			this.status = 200;
			this.body = {
				success: topic.id
			};
			yield next;
		})
		.nested('/:topicId')
		.get(function* (next) {
			let topicId = parseInt(this.params.topicId, 10);
			let topic = Topics.read({id: topicId});
			this.body = topic;
			this.status = !!topic ? 200 : 404;
			yield next;
		})
		.put(function* (next) {
			let topicId = parseInt(this.params.topicId, 10);

			let reqModel = this.request.body.fields;
			let whitelist = {
				description: true,
				duration: true,
				discussion: true,
				conclusion: true
			};

			Object.keys(reqModel).forEach(key=>{
				if (!(key in whitelist)) {
					delete reqModel[key];
				}
			});

			let topic = Topics.update({id: topicId}, reqModel);

			if (!!topic) {
				this.status = 200;
				this.body = {
					success: topic.id
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
