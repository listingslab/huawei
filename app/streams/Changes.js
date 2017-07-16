import CRUD from './CRUD';
export default class ChangesStream {
	constructor(autoUpdate = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/changes/i)
			);

		// update changes on post and delete
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
				res.method.match(/get/i)
			)
			.subscribe(...arguments);

		return this.subscription;
	}

	unsubscribe() {
		this.subscription.dispose();
		this.disposeRes.dispose();
	}

	create() {
		CRUD.create('changes');
	}

	read() {
		CRUD.read('changes');
	}

	update(id, model) {
		CRUD.update('changes', id, model);
	}

	delete(id) {
		CRUD.delete('changes', id);
	}
}
