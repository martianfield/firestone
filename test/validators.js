'use strict';

const should = require("chai").should();
const validateEmail = require(__dirname + '/../lib/validators').validateEmail;


describe("Validators", () => {
	describe('validateEmail', () => {
		it('valid email addresses', () => {
			// arrange
			let items = ['peter@peter.com', 'john.doe@unknow.victims', 'rené.müller@nestlé.ch'];
			// act / validate
			items.forEach((item) => {
				let validation = validateEmail(item);
				validation.valid.should.equal(true, `did not correctly validate '${validation.value}'`);
			});
		});
		it('invalid email addresses', () => {
			// arrange
			let items = ['ble#para.com','ann@ann@ann.ann', 'dodo@dodo', 'dum@dum.dum'];
			// act / assert
			items.forEach((item) => {
				let validation = validateEmail(item);
				validation.valid.should.equal(false, `did not correctly validate '${validation.value}'`);
			});
		})
	})
	
});
