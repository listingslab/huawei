import CRUD from './CRUD';
export default class CharterStream {
	constructor(autoUpdate = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection === 'deliverables' ||
				res.collection === 'milestones' ||
				res.collection === 'charter'
			);

		// update charter model if there are any posts to child collections
		if ( autoUpdate ) {
			this.disposeRes = this.responseStream
			.filter(
				res =>
				res.method.match(/post|delete/i)
			)
			.subscribe(this.read);
		} else {
			this.disposeRes = { dispose: ()=>{} };
		}
	}

	subscribe() {
		this.subscription = this
			.responseStream
			.filter(
				res =>
				res.method.match(/get/i) &&
				res.collection === 'charter'
			)
			.subscribe(...arguments);
		return this.subscription;
	}

	unsubscribe() {
		this.subscription.dispose();
		this.disposeRes.dispose();
	}

	read() {
		CRUD.read('charter');
	}

	update(model) {
		CRUD.update('charter', null, model);
	}

	createMilestone() {
		CRUD.create('milestones');
	}

	createDeliverable() {
		CRUD.create('deliverables');
	}

	deleteDeliverable(id) {
		CRUD.delete('deliverables', id);
	}

	updateDeliverable(id, model) {
		CRUD.update('deliverables', id, model);
	}

	updateMilestone(id, model) {
		CRUD.update('milestones', id, model);
	}

	deleteMilestone(id) {
		CRUD.delete('milestones', id);
	}
}
