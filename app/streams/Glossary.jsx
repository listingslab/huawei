import CRUD from './CRUD';
export default class GlossaryStream {

	constructor() {
		this.responseStream = CRUD
			.responseStream
			.filter(
				res =>
				res.collection.match(/glossary/)
			);
	}

	subscribe() {
		this.subscripion = this
			.responseStream
			.filter(
				res =>
				res.method.toLowerCase() === 'get'
			)
			.subscribe(...arguments);
	}

	unsubscribe() {
		this.subscripion.dispose();
	}

	readWords(fragment) {
		CRUD.read('/glossary/' + fragment);
	}

	readWordNumbers() {
		CRUD.read('/glossary');
	}
}
