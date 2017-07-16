import CRUD from './CRUD';
export default class DeliverablesStream {
	constructor(autoUpdate = true) {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/deliverables/)
			);

		// update charter model if there are any posts to child collections
		if (autoUpdate) {
			this.autoUpdateStream = this.responseStream
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
		!!this.autoUpdateStream && this.autoUpdateStream.dispose();
	}

	read() {
		CRUD.read('deliverables');
	}

	delete(id) {
		CRUD.delete('deliverables', id);
	}

	createDeliverable() {
		CRUD.create('deliverables');
	}

	createTask(deliverableId) {
		CRUD.create(`deliverables/${ deliverableId }/tasks`);
	}

	updateTask(deliverableId, taskId, model) {
		CRUD.update(`deliverables/${ deliverableId }/tasks`, taskId, model);
	}

	deleteTask(deliverableId, taskId) {
		CRUD.delete(`deliverables/${ deliverableId }/tasks`, taskId);
	}

	createActivity(deliverableId, taskId) {
		CRUD.create(`deliverables/${ deliverableId }/tasks/${ taskId }/activities`);
	}

	deleteActivity(deliverableId, taskId, activityId) {
		CRUD.delete(`deliverables/${ deliverableId }/tasks/${ taskId }/activities`, activityId );
	}

	updateActivity(deliverableId, taskId, activityId, model) {
		CRUD.update(`deliverables/${ deliverableId }/tasks/${ taskId }/activities`, activityId, model );
	}

	updateDeliverable(id, model) {
		CRUD.update('deliverables', id, model);
	}

	updateMilestone(id, model) {
		CRUD.update('Milestones', id, model);
	}

	dispose() {
		this.autoUpdateStream.dispose();
	}
}
