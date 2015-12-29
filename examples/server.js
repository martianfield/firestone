'use strict';

const routeMaker = require('./../index.js').routeMaker;
const mapMaker = require('./../index.js').mapMaker;

const app = require('express')();

const config = {
	mongo: {
		uri: 'mongodb://localhost:27017/firestone_example'
	}
};

const routes = [
	{
		path: '/doctors',
		collection: 'doctors',
		map: mapMaker({actor:String, ordinal:String}, {fez:Boolean})
	},
	{
		path:'/toys', 
		collection: 'toys', 
		map: (body) => {
			return new Promise((fulfill, reject) => {
				if(body.name === undefined) {
					return reject(
						{
							errors:[
								{field:"name", reason:"missing"}
							]
						}
					);
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
		path: '/companions',
		collection: 'companions',
		map: mapMaker({name:String}, {scottish:Boolean}),
		auth: {
			POST: (request) => {
				return new Promise((fulfill, reject) => {
					if(new Date().getSeconds() % 2) {
						// nothing to pass
						return fulfill(true);
					} 
					else {
						// pass a status and a message
						return reject({status:403, message:"you are not authorized"});
					}
				})
			}
		}
	}
];

app.use(routeMaker(config, routes));


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`serving at http://localhost:${port}`);
