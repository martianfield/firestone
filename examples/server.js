'use strict';

const firestoneRouter = require('./../index.js').router;
const firestoneMapMaker = require('./../index.js').mapMaker;

const app = require('express')();

const config = {
	mongo: {
		uri: 'mongodb://localhost:27017/firestone_example'
	}
};

const routes = [
	{
		path:'/toys', 
		collection: 'toys', 
		map: (body) => {
			return new Promise((fulfill, reject) => {
				if(body.name === undefined) {
					return reject(new Error("missing parameter name"));
				} 
				else {
					let doc = {
						name: body.name,
						owner: body.owner
					}
					return fulfill(doc);
				}
		  })
		}
	},
	{
		path:'/cats',
		collection: 'cats',
		map: firestoneMapMaker({name:String, sold:Boolean}, {owner:String, age:Number})
	},
	{
		path:'/api/dogs',
		collection: "dogs",
		map: firestoneMapMaker({name:String, age:Number}, {musicalTaste:String})
	}
];

app.use(firestoneRouter(config, routes));


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`serving at http://localhost:${port}`);
