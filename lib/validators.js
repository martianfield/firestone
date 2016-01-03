'use strict';

module.exports.validateEmail = (email) => {
	let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = re.test(email);
    let error = valid ? "" : "invalid e-mail";

	return {
		valid: valid,
		value: email,
		error : error
	}
	/*
	NOTE:
	The regular expression used here DOES NOT comply to the required standard.
	In my book - however - this is good enough though. Mind that actual e-mail 
	validation is about people submitting an e-mail address that actually works
	and that they have access to ... not about format.
	Oh and yes, regex is not my strong suit ... I learn it, use it, don't use it
	for a long time, forget it, need to learn it again ;)
	*/
}