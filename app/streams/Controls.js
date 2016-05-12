import CRUD from './CRUD';
export default class ControlsStream {
	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/controls/i)
			);

		this._autoUpdateSub = this.responseStream
			.filter(
				res =>
				res.method.match(/post|delete/i)
			)
			.subscribe(this.read);
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
		this._autoUpdateSub.dispose();
		this.subscription.dispose();
	}

	create(model) {
		CRUD.create('controls', null, model);
	}

	read() {
		CRUD.read('controls');
	}

	delete(id) {
		CRUD.delete('controls', id, null);
	}

	update(id, model) {
		CRUD.update('controls', id, model);
	}

	dispose() {
		this._autoUpdateSub.dispose();
	}
}
