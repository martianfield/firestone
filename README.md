# Firestone

A thin REST API prototyping framework using Express and MongoDB.

**NOTE: EVERYTHING HERE IS IN ALPHA. THINGS ARE IN CONSTANT FLUX AND VERY MUCH INCOMPLETE.**

Note: Yes, I  am probably re-inventing the wheel here. There are other (better) solutions like FeathersJs ... have a look there.

Quickly create RESTful APIs using Node, Express, and Mongo.

## Quickstart

In its most basic form, a Firestone app looks like this:

```javascript
'use strict';
const firestone = require('firestone');

// define routes
const routes = [
	{
		path: '/doctors',
		collection: 'doctors',
		map: firestone.mapMaker({actor:String}, {fez:Boolean})
	}
]

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
```

