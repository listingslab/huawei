import CRUD from './CRUD';
export default class RisksStream {
	constructor(auto = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/risks/i) ||
				res.collection.match(/members/i)
			);

		// update risks on post and delete
		if ( auto ) {
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

	create() {
		CRUD.create('risks');
	}

	read() {
		CRUD.read('risks');
	}

	update(id, model) {
		CRUD.update('risks', id, model);
	}

	delete(id) {
		CRUD.delete('risks', id);
	}

	getMembers() {
		CRUD.read('members');
	}

}
