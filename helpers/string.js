exports.camel = function (str) {
	var ret = str[0].toUpperCase() + str.slice(1);
	return ret;
}