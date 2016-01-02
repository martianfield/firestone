const MongoClient = require('mongodb').MongoClient;
//const mongo = require('mongodb');

var db;

module.exports = function connect(uri) {
	if(!db) {
		db = MongoClient.connect(uri)
	} 
	return db;
}