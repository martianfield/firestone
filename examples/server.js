'use strict';
const firestone = require('./../index.js');

// define routes
const routes = [
	{
		path: '/doctors',
		collection: 'doctors',
		map: firestone.mapMaker({actor:String, ordinal:String}, {fez:Boolean})
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
		map: firestone.mapMaker({name:String}, {scottish:Boolean}),
		middleware: {
			POST: (req, res, next) => {
				if(new Date().getSeconds() % 2) {
					console.log("authorized");
					next();
				}
				else {
					console.log("not authorized");
					res.status(403).json({error: "you are not authorized"});
				}
			}
		}
	}
];

// configure firestone
firestone.config('mongoUri', 'mongodb://localhost:27017/firestone_example');
firestone.config('routes', routes);

// create express app and use routes
const app = require('express')();
app.use(firestone.routeMaker());

// serve the express app
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`serving at http://localhost:${port}`);
