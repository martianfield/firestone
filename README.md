# fiRESTone

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

## Responses

We could spend hours discussing the choices I made, but then we would at best end up with a solution somebody else would then disagree with. 

### GET

Successfully GETting a resource will result in

- a `200` HTTP Status code
- the resources(s) as JSON in the response body

Trying to GET a resource (by id) that does not exist, results in

- a `404` HTTP Status code
- a response body containing information about the error(s) as JSON (see example)

```JSON
{
	error: "resource could not be found"
}
```

Malformed requests (e.g. requesting an id that is not a string of 12 bytes or 24 hex characters) result in

- a `400` HTTP Status code
- a response body containing information about the error(s) as JSON (see example)

```JSON
{
	error: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
}
```

### POST

Successfully POSTing a new resource will result in 

- a `201` HTTP Status Code
- a link to the created resource in the HTTP Location Header
- the created object as JSON in the response's body (including the `_id` it got from Mongo)

Unsuccesful POSTing would mainly arise when the submitted values where insufficient or not meeting expected value types or ranges. Hence they return 

- a `422` (Unprocessable Entity) HTTP status code
- a JSON object in the reponse, containing an array of errors encountered (see below)

#### Error Response Body

The response body should contain useful information if the POST failed. If you use the map-maker, this will be created automatically. Here an example:

```JSON
{
	errors: [
		{field:"name", reason:"missing"},
		{field:"age", reason:"wrong type"}
	]
}
```

Currently only `missing` and `wrong type` are the only two types of reason given by the map-maker (you are free to add whatever you please though, if you manually define your maping function).

If you define your own map promise you need to define this yourself. Here an example:

```Javascript
let my_mapper = (body) => {
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
				name: body.name
			}
			return fulfill(doc);
		}
  })
}
```
