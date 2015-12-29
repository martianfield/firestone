# fiRESTone

Quickly create RESTful APIs using Node, Express, and Mongo.


## Responses

We could spend hours discussing the choices I made, but then we would at best end up with a solution somebody else would then disagree with. 

### GET

TODO

### POST

Successfully POSTing a new resource will result in 

- a `200` HTTP Status Code
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
