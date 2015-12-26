'use strict';

const firestone = require('./../index.js');

const app = require('express')();

const config = {
	mongo: {
		uri: 'mongodb://localhost:27017/firestone_example',
		uri2: 'mongodb://localhost:27010/firestone_example'
	}
};
const routes = [
	{path:'/hats', coll: 'hats'},
	{path:'/cats', coll: 'cats'},
	{path:'/dogs', coll: 'dogs'},
	{path:'/toys', coll: 'toys'}
];

app.use(firestone(config, routes));


const port = process.env.PORT || 3000;
app.listen(port);
console.log(`serving at http://localhost:${port}`);
