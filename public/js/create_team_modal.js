function initCreateTeamModal(){
	$('#create-team-modal').find('input, textarea').val('');
	$('#create-team-modal .tags').html('<input type="text" class="tag"/>' + 
          '<a href="#" class="add-tag" title="点击添加标签"><i class="icon-plus"></i></a>');

	$('#create-team-modal').modal({
		backdrop: "static",
		keyboard: false
	});
}

function showCreateTeamModal(){
	$('#create-team-modal').modal('show');
}
function hideCreateTeamModal(){
	$('#create-team-modal').modal('hide');
}

function initCreateTeamModalEvents(){
	$('#create-team-modal').on('click', '.add-tag', function(event){
		event.preventDefault();
		var input = $('<input type="text" class="tag"/>');
		input.insertBefore($(this));
	});

	$('#create-team-modal .confirm').click(function(event){
		var $modal = $('#create-team-modal');
		var data = {
			contest: $modal.find('input[name="name"]').val(),
			url: $modal.find('input[name="url"]').val(),
			deadLine: $modal.find('input[name="deadLine"]').val(),
			class: $modal.find('select[name="class"]').val(),
			tags: getTags($modal.find('.tags .tag')),
			details: $modal.find('textarea[name="details"]').val()
		}
		console.log(data);
		$.post('/postNewTeam', data, function(result){
			hideCreateTeamModal()
			generateTeamBlock(data, team.create.id);			
		});
	});
}

function generateTeamBlock(option, userId){
	var $tb = $('<div class="team-block" />');

	var cc = "<div class='contest-creator'>"+
				"<a href='"+option.url+"' class='contest-title'>"+option.contest + "</a>"+
				"<span class='creator' data-id='11'>创建者：<a href='/users_information'>" + userId + "</a></span>"+
			 "</div>";

	var t = "<div class='tags'>标签：";
	for (var i=0, len=option.tags.length; i<len; i++){
		t += "<span class='tag'>"+option.tags[i]+"</span>";
	}
	t += "</div>";

	var d = "<div class='date'>"+
				"<span>创建日期：" + new Date().toLocaleDateString() + "</span>"+
				"<span>截止日期：" + new Date(option.deadLine).toLocaleDateString() + "</span>"+
			"</div>";

	var td = "<div class='tag-date'>"+
				t + d +
			 "</div>";

	var tei = "<div class='team-info'>"+
				cc + td +
			  "</div>";

	var $ti = $('<div class="team-intro" />').append('<h4>详细信息：</h4>').append('<p>'+option.details+'</p>');
	var s = "<div class='status'>"+
				"<span class='label label-info'>组队中</span>"+
				"<button class='btn btn-mini'>关闭</button>"+
				"<button class='btn btn-danger btn-mini'>删除</button>"+
			"</div>"+
			"<a href='#' class='join'>"+
				"<i class='my-icon join-icon'></i>申请加入"+
			"</a>"+
			"<div class='msg-writing'>"+
				"<input type='text' class='msg span6' placeholder='请填写申请信息'/>"+
				"<button class='btn'>发送</button>"+
			"</div>";

	$tb.append(tei).append($ti).append(s);

	var divider = "<div class='divider'>"+
						"<span class='first'></span>"+
						"<span class='second'></span>"+
						"<span class='third'></span>"+
						"<span class='second'></span>"+
						"<span class='first'></span>"+
					"</div>";

	var $container = $('div.content.team');
	$container.append(divider);
	$container.append($tb);
}

function getTags(elems){
	var result = [];
	for(var i = 0, len = elems.length; i < len; i++){
		var value = $(elems[i]).val();
		if(value != '')
			result.push(value);
	}
	return result;
}

initCreateTeamModalEvents();