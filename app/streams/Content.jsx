import CRUD from './CRUD';
import appState from 'state/app';
export default class ContentStream {

	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/content/)
			);
	}

	getContent(slug) {
		CRUD.read (`/content/${appState.locale}`, slug);
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
