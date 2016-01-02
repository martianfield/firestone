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
				// TODO not quite DRY in here
				let doc = {};
				for(var prop in mandatory) {
					if(mandatory.hasOwnProperty(prop)) {
						let conversion = convert(prop, body[prop], mandatory[prop]);
						if(conversion.success) {
							doc[prop] = conversion.value;	
						}
						else {
							errors.push(conversion.error);
						}
					}
				}

				for(var prop in optional) {
					if(optional.hasOwnProperty(prop)) {
						if(body[prop]) {
							let conversion = convert(prop, body[prop], optional[prop]);
							if(conversion.success) {
								doc[prop] = conversion.value;	
							}
							else {
								errors.push(conversion.error);
							}
						}							
					}
				}
				if(errors.length > 0) {
					return reject({errors:errors})
				}
				else {
					return fulfill(doc);	
				}
				
			}
		})
	}
	return map;
}

function convert(field, raw, converter) {
	let value = converter(raw);
	let success = true;
	let error = {};
	if(converter === Number) {
		if(isNaN(value)) {
			success = false;
			error = {
				field: field, 
				reason: "wrong type"
			}
		}	
	}
	return {
		success: success,
		value: value,
		error: error
	}
}