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
	// setup default middleware
	if(!definition.middleware) definition.middleware = {};
	['POST', 'GET', 'PUT', 'DELETE'].forEach((verb) => {
		if(!definition.middleware[verb]) definition.middleware[verb] = (req, res, next) => { next() };
	})
	// path
	router.route(definition.path)
		// GET
		.get(definition.middleware.GET)
		.get((req, res) => {
			let promises = [];
			promises.push(connect(config));
			if(definition.auth.GET) {
				promises.push(definition.auth.GET);
			}
			Promise.all(promises)
				.then((values) => {
					return values[0].collection(definition.collection).find({});
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
		.post(definition.middleware.POST)
		.post((req, res) => {
			let doc = null;
			Promise.all([connect(config), definition.map(req.body)])
				.then((values) => {
					let db = values[0];
					doc = values[1];
					return db.collection(definition.collection).insertOne(doc);
				})
				.then((result) => {
					doc._id = result.insertedId;
					let insertedId = result.insertedId;
					res.location(`${definition.path}/${insertedId}`);
					res.status(201).json(doc);
				})
				.catch((err) => {
					if(err.status) {
						res.status(err).json(err);
					}
					else {
						res.status(422).json(err);	
					}
					
				})
		})

	// path/:id
	router.route(definition.path + '/:id')
		// GET
		.get(definition.middleware.GET)
		.get((req, res) => {
			let id = req.params.id;
			connect(config)
				.then((db) => {
					return db.collection(definition.collection).findOne({_id:ObjectId.createFromHexString(id)})
				})
				.then((result) => {
					if(result === null) {
						res.status(404).json({error:"resource not found"})
					} else {
						res.json(result);	
					}
				})
				.catch((err) => {
					res.status(400).json({error:err.message});
				})
		})
		// DELETE
		.delete(definition.middleware.DELETE)
		.delete((req, res) => {
			let id = req.params.id;
			connect(config)
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
		// PUT
		.put(definition.middleware.PUT)
		.put((req, res) => {
			let id = req.params.id;
			Promise.all([connect(config), definition.map(req.body)])
				.then((values) => {
					let db = values[0];
					let doc = values[1];
					return db.collection(definition.collection).updateOne({_id:ObjectId.createFromHexString(id)}, doc)
				})
				.then((result) => {
					res.json(result);
				})
				.catch((err) => {
					res.json(err);
				})
		})
}

// connects to Mongo Database
// returns a promise
function connect(config) {
	return MongoClient.connect(config.mongo.uri);
}