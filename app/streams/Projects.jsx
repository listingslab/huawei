import CRUD from './CRUD';
import appState from 'state/app';
export default class ProjectsStream {

	constructor(auto = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/projects/)
			);

		// update charter model if there are any posts to child collections
		if (auto) {
			this.readSubscription = this.responseStream
			.filter(
				res =>
				res.method.match(/post/i) ||
				res.method.match(/delete/i)

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
		this.readSubscription && this.readSubscription.dispose();
		this.subscription.dispose();
	}

	create(model) {
		CRUD.create('/projects', null, model);
	}

	read() {
		CRUD.read('/projects');
	}

	get(id) {
		CRUD.read('/projects', id || appState.projectId);
	}

	update(id, model) {
		CRUD.update('/projects', id, model);
	}

	delete(id) {
		CRUD.delete('/projects', id);
	}

 }
