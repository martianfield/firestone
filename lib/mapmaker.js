'use strict';

module.exports = function(mandatory, optional) {
	let map = (body) => {
			return new Promise((fulfill, reject) => {
				let errors = [];
				// check if mandatory fields are provided
				for (var prop in mandatory) {
				  if(mandatory.hasOwnProperty(prop)) {
				    if(body[prop] === undefined) {
				    	errors.push({field:prop, reason:"missing"});
				    }
				  } 
				}
				if(errors.length > 0) {
					return reject({errors:errors});
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
							if(body[prop]) {
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