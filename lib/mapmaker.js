'use strict';

module.exports = function(mandatory, optional) {
	let map = (body) => {
			return new Promise((fulfill, reject) => {
				// check if mandatory fields are provided
				let missingFields = [];
				for (var prop in mandatory) {
				  if(mandatory.hasOwnProperty(prop)) {
				    //console.log("obj." + prop + " = " + mandatory[prop]);
				    if(body[prop] === undefined) {
				    	console.log("missing field found: " + prop);
				    	missingFields.push(prop);
				    }
				  } 
				}
				if(missingFields.length > 0) {
					let missingParameters = missingFields.map((item) => `'${item}'`).join(', ');
					return reject(new Error("missing parameter()s: " + missingParameters));
				} 
				else {
					let doc = {};
					for(var prop in mandatory) {
						if(mandatory.hasOwnProperty(prop)) {
							doc[prop] = body[prop];	
						}
					}
					for(var prop in optional) {
						if(optional.hasOwnProperty(prop)) {
							if(doc[prop]) {
								doc[prop] = body[prop];
							}							
						}
					}
					return fulfill(doc);
				}
		  })
		}
	return map;
}