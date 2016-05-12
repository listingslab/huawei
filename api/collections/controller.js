'use strict';
let db = require('../db');
let Index = require('./index');

class CollectionController {

	constructor(collectionName, template) {
		this.template = template || {};
		this.collectionName = collectionName;
		this.collection = db.getCollectionAlways(collectionName);
	}

	create(model) {
		model = model || {};
		let doc = this.collection.insert(
			Object.assign(
				{
					id: Index.getIndex(this.collectionName)
				},
				this.template,
				model
			)
		);
		db.save();
		return doc;
	}

	read(queryObject) {
		return this.collection.findObject(queryObject);
	}

	readAll(queryObject) {
		return this.collection.find(queryObject);
	}

	update( queryObject, updates) {
		let model = this.collection.findObject(queryObject);
		if (!model) { return null; }
		Object.assign(model, updates);
		this.collection.update(model);
		db.save();
		return model;
	}

	delete( queryObject ) {
		this.collection.removeWhere( queryObject );
		db.save();
	}

	static deleteAll( queryObject ) {
		db.listCollections().forEach(
			collection => {
				db.getCollection(collection.name).removeWhere( queryObject );
			}
		);
		db.save();
	}
}

module.exports = CollectionController;
