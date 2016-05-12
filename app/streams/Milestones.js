import CRUD from './CRUD';
export default class ChangesStream {
	constructor(autoUpdate = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/milestones/i)
			);

		// update milestones on post and delete
		if ( autoUpdate ) {
			this.disposeRes = this.responseStream
			.filter(
				res =>
				res.method.match(/post|delete/i)
			)
			.subscribe(this.read);
		}
	}

	subscribe() {
		this.subscription = this
			.responseStream
			.filter(
				res =>
				res.method.match(/get/i)
			)
			.subscribe(...arguments);

		return this.subscription;
	}

	unsubscribe() {
		this.subscription.dispose();
		this.disposeRes && this.disposeRes.dispose();
	}

	create() {
		CRUD.create('milestones');
	}

	read() {
		CRUD.read('milestones');
	}

	update(id, model) {
		CRUD.update('milestones', id, model);
	}

	delete(id) {
		CRUD.delete('milestones', id);
	}
}
