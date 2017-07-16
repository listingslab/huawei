'use strict';
let CollectionController = require('../collections/controller');
let template = require('../models/risk');
let Risks = new CollectionController('risks', template);

function route(app) {
	app
		.route('/projects/:projectId/risks')
		.post(function* (next) {
			let projectId = parseInt( this.params.projectId, 10 );
			let newRisk = Risks.create({ $projectId: projectId });
			this.status = 200;
			this.body = {
				success: newRisk.id
			};

			yield next;
		})
		.get(function* (next) {
			let projectId = parseInt( this.params.projectId, 10);
			this.body = {
				items: Risks.readAll({ $projectId: projectId })
			};
			this.status = 200;
			yield next;
		})
		.nested('/:riskId')
		.get(function* (next) {
			let riskId = parseInt(this.params.riskId, 10);
			let risk = Risks.read({id: riskId});
			if (!!risk) {
				this.status = 200;
				this.body = risk;
			} else {
				this.status = 404;
			}

			yield next;
		})
		.put(function* (next) {
			let riskId = parseInt(this.params.riskId, 10);
			let updates = this.request.body.fields;
			let risk = Risks.update({id: riskId}, updates);
			if (!!risk) {
				this.status = 200;
				this.body = {
					success: risk.id
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
			let riskId = parseInt(this.params.riskId, 10);
			let risk = Risks.read({id: riskId});
			if (!!risk) {
				Risks.delete({ id: riskId });
				this.status = 200;
				this.body = {
					success: risk.id
				};
			} else {
				this.status = 404;
				this.body = {
					error: 'no record found'
				};
			}
		});
}

module.exports = route;
