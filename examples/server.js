'use strict';

const firestone = require('./../index.js');

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
			let doc = {
				name: body.name,
				owner: body.owner
			}
		return doc;
		}
	}
];

app.use(firestone(config, routes));


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`serving at http://localhost:${port}`);
