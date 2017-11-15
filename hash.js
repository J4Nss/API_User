var crypto = require('crypto'); // import built-in cryptographic library
exports.genRandomString = function(length){
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex') /* convert to hexadecimal format */
		.slice(0,length); /* return required number of characters */
};
exports.sha512 = function(password, salt){
	var hash = crypto.createHmac('sha512', salt); /* Hashing with sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt:salt,
		passwordHash:value
	};
};