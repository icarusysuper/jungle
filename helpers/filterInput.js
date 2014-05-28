var sanitize = require('validator').sanitize;

module.exports = function(str){
	var result = sanitize(str).trim();
	return result;
}