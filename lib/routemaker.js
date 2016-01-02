'use strict'
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const connect = require(__dirname + '/db.js');

// let DB = null;

module.exports = function() {
	const router = require('express').Router();
	// set up middleware
	router.use(bodyParser.urlencoded({extended:false}));
	router.use(bodyParser.json());

	let err = null;
	// check parameter
	if(this.routes === undefined ) {
		err = { message: 'Please provide routes!'}
	} 
	else if(!(this.routes.constructor === Array)) {
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
	for(var i=0; i < this.routes.length; i += 1) {
		createRoute(router, this.routes[i], this);
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
			connect(config.mongoUri)
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
					console.log("error:" + err);
					res.json(err);
				})
		})
		// POST
		.post(definition.middleware.POST)
		.post((req, res) => {
			let doc = null;
			Promise.all([connect(config.mongoUri), definition.map(req.body)])
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
			connect(config.mongoUri)
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
			connect(config.mongoUri)
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
			Promise.all([connect(config.mongoUri), definition.map(req.body)])
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

