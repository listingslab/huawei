import CRUD from './CRUD';
export default class MeetingsStream {
	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/meeting/)
			);
	}

	subscribe() {
		this.subscription = this
			.responseStream
			.filter(
				res =>
				res.method.toLowerCase() === 'get'
			)
			.subscribe(...arguments);

		return this.subscription;
	}

	unsubscribe() {
		this.subscription.dispose();
	}

	read() {
		CRUD.read('meeting');
	}

	update(model) {
		CRUD.update('meeting', null, model);
	}
}
