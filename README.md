# Firestone

A thin REST API prototyping framework using Express and MongoDB.

# NOTE: EVERYTHING HERE IS IN ALPHA. THINGS ARE IN CONSTANT FLUX AND VERY MUCH INCOMPLETE

Note: Yes, I  am probably re-inventing the wheel here. There are other (better) solutions like FeathersJs ... have a look there.

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

## Filtering

Filtering is done by providing a `GET` request with a `filter` query string parameter.

A filter has the form `<name><operator><value>`.

Supported operators are:

- `==` : exact match
- `<to be decided>`: contains (for strings)

Or is achieved by listing filters using commas as the delimter.

And is achieved by adding additional `filter` query parameters using the standard `&`. This results in an array of `filter` paramaters.


