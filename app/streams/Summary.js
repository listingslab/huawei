import CRUD from './CRUD';
export default class ControlsStream {
	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/summary/i)
			);
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
	}

	read() {
		CRUD.read('summary');
	}

	update(model) {
		CRUD.update('summary', null, model);
	}

	delete() {
		CRUD.delete('summary');
	}

	dispose() {}
}
