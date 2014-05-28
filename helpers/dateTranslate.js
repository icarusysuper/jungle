module.exports = function(date){
	var now = Date.now();
	var dif = now - date;
	if (dif < 60 * 1000){
		return "刚刚";
	} else if (dif < 60 * 60 * 1000){
		return parseInt(dif/(60*1000))+" 分钟前";
	} else if (dif < 24 * 60 * 60 * 1000){
		return parseInt(dif/(60*60*1000))+" 小时前";
	} else {
		date = new Date(date);
		var month = date.getMonth()+1
		  , day = date.getDate()
		  , hours = date.getHours()
		  , min = date.getMinutes();
		return month + "-" + day + " " + hours + ":" + min;
	}
};