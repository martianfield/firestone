'use strict'
const MongoClient = require('mongodb').MongoClient;

module.exports = function(config, routes) {
	const router = require('express').Router();
	let err = null;
	// check parameter
	if(routes === undefined ) {
		err = { message: 'Please provide routes!'}
	} 
	else if(!(routes.constructor === Array)) {
		err = { message: 'Please provide an array of routes!'}
	}
	// abort if err
	if(err) {
		let errorOut = `Firestone Error: ${err.message}`;
		console.error(errorOut);
		router.use('/', (req, res) => {
			res.send(errorOut)
		})
		return router;
	}
	
	// create routes
	for(var i=0; i < routes.length; i += 1) {
		createRoute(router, routes[i], config);
	}
	return router;
};

function createRoute(router, definition, config) {
	router.route(definition.path)
		.get((req, res) => {
			MongoClient.connect(config.mongo.uri)
				.then((db) => {
					return db.collection(definition.coll).find({});
				})
				.then((cursor) => {
					return cursor.toArray();
				})
				.then((content) => {
					res.status(200).json(content);
					//console.log(JSON.stringify(content, null, 2));
				})
				.catch((err) => {
					res.json(err);
				})
		})
}