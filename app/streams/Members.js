import CRUD from './CRUD';
export default class MembersStream {
	constructor(auto = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/members/i)
			);

		if (auto) {
			this.autoUpdateSub = this.responseStream
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
		this.autoUpdateSub && this.autoUpdateSub.dispose();
	}

	create(model) {
		CRUD.create('members', null, model);
	}

	read() {
		CRUD.read('members');
	}

	delete(id) {
		CRUD.delete('members', id, null);
	}

	update(id, model) {
		CRUD.update('members', id, model);
	}


}
