'use strict';
let db = require('../db');
let collection = db.getCollectionAlways('index');

let api = {
	getIndex: function(type) {
		let key = { type: type };
		let index = { type: type, index: 0 };
		let model = collection.findObject(key) || collection.insert(index);
		model.index++;
		collection.update(model);
		return model.index;
	}
};

module.exports = api;

