'use strict';
let Loki = require('lokijs');
let db = process.env.PMAPP_DB_PATH ? new Loki(process.env.PMAPP_DB_PATH) : new Loki(__dirname + '/db.json');

db.getCollectionAlways = function(name) {
	let collection = db.getCollection(name) || db.addCollection(name);
	return collection;
};

module.exports = db;
