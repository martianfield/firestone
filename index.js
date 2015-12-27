'use strict'
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

module.exports = function(config, routes) {
	const router = require('express').Router();
	// set up middleware
	router.use(bodyParser.urlencoded({extended:false}));
	router.use(bodyParser.json());

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
	// path
	router.route(definition.path)
		// GET
		.get((req, res) => {
			MongoClient.connect(config.mongo.uri)
				.then((db) => {
					return db.collection(definition.collection).find({});
				})
				.then((cursor) => {
					return cursor.toArray();
				})
				.then((content) => {
					res.status(200).json(content);
				})
				.catch((err) => {
					res.json(err);
				})
		})
		// POST (insert)
		.post((req, res) => {
			var promiseConnect = MongoClient.connect(config.mongo.uri);
			var promiseMap = definition.map(req.body);
			Promise.all([promiseConnect, promiseMap])
				.then((values) => {
					let db = values[0];
					let doc = values[1];
					return db.collection(definition.collection).insertOne(doc);
				})
				.then((result) => {
					doc._id = result.insertedId;
					res.status(201).json(doc)
				})
				.catch((err) => {
					res.status(422).json({error:err.message});
				})
		})

	// path/:id
	router.route(definition.path + '/:id')
		// GET
		.get((req, res) => {
			let id = req.params.id;
			MongoClient.connect(config.mongo.uri)
				.then((db) => {
					return db.collection(definition.collection).findOne({_id:ObjectId.createFromHexString(id)})
				})
				.then((result) => {
					res.json(result);
				})
				.catch((err) => {
					res.json(err);
				})
		})
		// DELETE
		.delete((req, res) => {
			let id = req.params.id;
			MongoClient.connect(config.mongo.uri)
				.then((db) => {
					return db.collection(definition.collection).deleteOne({_id:ObjectId.createFromHexString(id)})
				})
				.then((result) => {
					res.json(result);
				})
				.catch((err) => {
					res.json(err);
				})
		})
		// TODO: PUT (update)

}
