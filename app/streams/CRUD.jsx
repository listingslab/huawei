import Rx from 'rx';
import request from 'then-request';
import appState from 'state/app';
export default class CRUDStream {

	static responseStream = new Rx.Subject({
		body: '',
		res: '',
		method: '',
		collection: '',
		id: null
	})
	static requestStream = new Rx.Subject()

	constructor() {
		let requestHandler = ({method, collection, id, model}) => {
			let root = collection[0] === '/';
			let project = root ? '/' : `/projects/${appState.projectId}/`;
			if ( root ) {
				collection = collection.substring(1);
			}
			return request(
				method,
				`${appState.serverURL}${project}${collection}/${ !!id || id === 0 ? id : '' }`,
				{
					json: null || model
				}
			).done(
				(res)=>{
					let body = res.headers['content-type'].match(/json/) !== null ? JSON.parse(res.body) : null;
					if ( window.DEBUG ) {
						console.log(`${method}-> ${collection}`);
					}
					this.responseStream.onNext({body, res, method, collection, id});
				}
			);
		};

		let errorHandler = (error) => {
			// TODO
			console.error(error);
		};

		this.responseStream = CRUDStream.responseStream;
		this.requestStream = CRUDStream.requestStream;
		this.requestStream
			.subscribe(requestHandler, errorHandler);
	}

	subRequest() {
		this.requestStream.subscribe(...arguments);
	}

	subscribe() {
		return this.responseStream.subscribe(...arguments);
	}

	create(collection, id, model) {
		let method = 'POST';
		this.requestStream.onNext({method, collection, id, model});
	}

	read(collection, id) {
		let method = 'GET';
		let model = null;
		this.requestStream.onNext({method, collection, id, model});
	}

	update(collection, id, model) {
		let method = 'PUT';
		this.requestStream.onNext({method, collection, id, model});
	}

	delete(collection, id) {
		let method = 'DELETE';
		let model = null;
		this.requestStream.onNext({method, collection, id, model});
	}
}

export default window.crud = new CRUDStream;
