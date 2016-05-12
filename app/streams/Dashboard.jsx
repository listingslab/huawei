import CRUD from './CRUD';
import appState from 'state/app';
export default class DashboardStream {

	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/dashboard/)
			);

		// update charter model if there are any posts to child collections
		this.readSubscription = this.responseStream
			.filter(
				res =>
				res.method.match(/post/i) ||
				res.method.match(/delete/i)

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
		this.subscription.dispose();
		this.readSubscription.dispose();
	}

	getDashboardData(projectId) {
		CRUD.read('/dashboard', projectId);
	}


 }
