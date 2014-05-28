var dataObj = {
	"timeline":
	{
		"headline":"jungle",
		"type":"default",
		"text":"<p>jungle的理念是：解决用户渴望找到合适的人共同组建一个具有高度凝聚力团队的问题；并借助这个契机，扩大用户的交友圈子。</p>",
		"asset": {
			"media":"/image/timeline-image/tree5.jpg",
			"credit":"",
			"caption":"jungle logo"
		},
		"date": [
			{
				"startDate":"2013,9,18",
				"endDate":"2013,11,9",
				"headline":"第九届中山大学“百田杯”新生软件创意大赛",
				"text":"<p>只要你敢想，这里就是你的舞台</p>",
				"tag":"赛事",
				
				"asset": {
					"media":"/image/timeline-image/sscc.png",
					"thumbnail":"/image/timeline-image/sscc小图标.jpg",
					"credit":"",
					"caption":"新生软件创意大赛"
				}
			},
			{
				"startDate":"2013,9,19",
				"endDate":"2013,12,14",
				"headline":"第九届中山大学“百田杯”新生软件创新设计大赛",
				"text":"<p>年度盛事，敬请期待。</p>",
				"tag":"赛事",
				"asset": {
					"media":"/image/timeline-image/ssic.png",
					"thumbnail":"/image/timeline-image/ssic小图标.png",
					"credit":"",
					"caption":"软件创新设计大赛"
				}
			},
			{
				"startDate":"2014,1,1",
				"endDate":"2014,1,10",
				"headline":"2014全国信息安全大赛",
				"text":"<p>近期有宣讲会，专家与往届选手会与您分享经验，敬请关注。</p>",
				"tag":"赛事",
				"asset": {
					"media":"/image/timeline-image/信息安全大赛海报.jpg",
					"thumbnail":"/image/timeline-image/信息安全大赛小图标.jpg",
					"credit":"",
					"caption":"全国信息安全大赛"
				}
			},
			{
				"startDate":"2014,2,1",
				"endDate":"2014,3,10",
				"headline":"赢在中大",
				"text":"<p>创业技能&策划大赛</p>",
				"tag":"赛事",
				"asset": {
					"media":"/image/timeline-image/赢在中大海报.jpg",
					"thumbnail":"/image/timeline-image/赢在中大小图标.jpg",
					"credit":"",
					"caption":"赢在中大"
				}
			}
		]
		// "era": [
		// 	{
		// 		"startDate":"2011,12,10",
		// 		"endDate":"2011,12,11",
		// 		"headline":"Headline Goes Here",
		// 		"tag":"This is Optional"
		// 	}
			
		// ],
		// "chart": [
		// 	{
		// 		"startDate":"2011,12,10",
		// 		"endDate":"2011,12,11",
		// 		"headline":"Headline Goes Here",
		// 		"value":"28"
		// 	}
			
		// ]
	}
}

var createTimeline = function(id, w, h, dataSource) {
	createStoryJS({
		type: 'timeline',
		width: w,
		height: h,
		source: dataSource,
		embed_id: id,
		lang: 'zh-cn'
	});
}

$(document).ready(function() {
	createTimeline('jungle-timeline', 600, 580, dataObj);
});