import CRUD from './CRUD';
export default class GuideStream {

	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/guide/)
			);
	}

	getContent(slug) {
		CRUD.read (`/guide`, slug);
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

}
