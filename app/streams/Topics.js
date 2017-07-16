import CRUD from './CRUD';
export default class TopicsStream {
	constructor(autoUpdate = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/topics/i)
			);

		// update topics on post and delete
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
		CRUD.create('topics');
	}

	read() {
		CRUD.read('topics');
	}

	update(id, model) {
		CRUD.update('topics', id, model);
	}

	delete(id) {
		CRUD.delete('topics', id);
	}
}
