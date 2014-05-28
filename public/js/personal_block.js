function initPersonalBlockEvents(){
	addEventListenerToModifyTagsIcon($('.personal-block .tags .modify-icon'));
	addEventListenerToSaveTagsIcon($('.personal-block .tags .save-icon'));	

	addEventListenerToModifyBaseInfoIcon($('.personal-block .base-info .modify-icon'));
	addEventListenerToSaveBaseInfoIcon($('.personal-block .base-info .save-icon'));
	
	addEventListenerToAddTags($('.personal-block .tags .add-tag'));
	addEventListenerToDelTags($('.personal-block .tags'));
	

	addEventListenerToToggleMsgBox($('.personal-block .msgs>a'));
	addEventListenerToFoldMsg($('.personal-block .msgs .fold-msg'));
	
	addEventListenerToCheckTagLength($('.personal-block .tag-list .tag-name-block .tag-name'));
	

	addEventListenterToCheckTagDesc($('.personal-block .tag-list'));

	addEventListenerToUploadButton($('.personal-block .upload_avatar'));
}

function addEventListenterToCheckTagDesc($dom) {
	$dom.on('input', '.tag-description', function(event){
		if($(event.target).html().length > 20){
			showWarning($(event.target).parents('.tags').find('.info-title .warning'), '标签描述最多20字');
			var text = ($(event.target).html()).slice(0,20);
			$(event.target).html(text);
		}
		else
			hideWarning($(event.target).parents('.tags').find('.info-title .warning'));
	});
}

function addEventListenerToCheckTagLength($dom) {
	$dom.keyup(function(event){
		var $textDom = $(event.target);
		var length = 0;

		if($textDom.val())
			length = $textDom.val().length;

		if(length > 5 || length < 2) {
			showWarning($(event.target).parents('.tags').find('.info-title .warning'), '标签名必须为2-5个字');
			var text = $textDom.val().slice(0, 5);
			$textDom.val(text);
		} else {
			hideWarning($(event.target).parents('.tags').find('.info-title .warning'));
		}
	});
}

function addEventListenerToDelTags($dom) {
	$dom.on('click', '.delete-tag', function(event){
		event.preventDefault();
		$(event.target).parents('li').remove();
	});
}
	

function addEventListenerToAddTags($dom) {
	$dom.click(function(event){
		event.preventDefault();
		var newTagElem = $("<li>" + 
			"<div class='tag-name-block'><i class='icon-remove delete-tag' title='点击删除标签'></i>" +
			"<input class='tag-name' type='text' value='新标签'></div>" + 
			"<div class='tag-description' contenteditable=true>标签描述</div>" + 
			"<div class='clear'></div></li>");
		$(newTagElem).find('.delete-tag').show();
		$(event.target).siblings('ul').append(newTagElem);
		addEventListenerToCheckTagLength($('.personal-block .tag-list .tag-name-block .tag-name'));
	});
}

function addEventListenerToModifyTagsIcon($dom) {
	$dom.click(function(event){
		event.preventDefault()
		var $tagList = $(event.target).parent().siblings('ul');
		$tagList.find('.tag-name-block .tag-name').removeAttr('disabled');
		$tagList.find('.tag-description').attr('contenteditable', 'true');
		$tagList.find('.delete-tag').show();

		$(event.target).parent().siblings('.add-tag').show();
		$(event.target).siblings('.save-icon').css('display', 'inline-block');
		$(event.target).hide();
	});
}

function addEventListenerToModifyBaseInfoIcon($dom) {
	$dom.click(function(event){
		event.preventDefault()
		var $tagList = $(event.target).parent().siblings('ul');
		$tagList.find('.value').attr('contenteditable', 'true');

		$(event.target).siblings('.save-icon').css('display', 'inline-block');
		$(event.target).hide();
	});
}

function addEventListenerToSaveTagsIcon($dom) {
	$dom.click(function(event){
		event.preventDefault();
		var $tagList = $(event.target).parent().siblings('ul');
		$tagList.find('.tag-name-block .tag-name').attr('disabled', 'disabled');
		$tagList.find('.tag-description').removeAttr('contenteditable');
		$tagList.find('.delete-tag').hide();

		$(event.target).parent().siblings('.add-tag').hide();
		$(event.target).siblings('.modify-icon').css('display', 'inline-block');
		$(event.target).hide();

		hideWarning($(event.target).siblings('.info-title .warning'));
		saveTags($tagList.find('li'));
	});
}


function addEventListenerToSaveBaseInfoIcon($dom) {
	$dom.click(function(event){
		event.preventDefault();
		var $baseInfoList = $(event.target).parent().siblings('ul');
		$baseInfoList.find('.value').removeAttr('contenteditable');

		$(event.target).siblings('.modify-icon').css('display', 'inline-block');
		$(event.target).hide();

		saveInfo($baseInfoList.find('li'));
	});
}

function addEventListenerToFoldMsg($dom) {
	$dom.click(function(event){
		event.preventDefault();
		if($(event.target).html() == '展开'){
			var msgElem = $(event.target).siblings('.msg'),
      			curHeight = msgElem.height(),
      			autoHeight = msgElem.css({
					'text-overflow': 'inherit',
					'white-space': 'normal',
					height: 'auto'
				}).height();
			$(msgElem).height(curHeight).animate({
				'height': autoHeight+'px'
			}, 500);
			setRead($(event.target).parents('li'));
			$(event.target).html('收起');
		}
		else{
			$(event.target).siblings('.msg').animate({
				height: '1.2em'
			}, 500, function(){
				$(event.target).siblings('.msg').css({
					'text-overflow': 'ellipsis',
					'white-space': 'nowrap'
				})
			});
			$(event.target).html('展开');
		}
	});
}

function addEventListenerToToggleMsgBox($dom) {
	$dom.click(function(event){

		event.preventDefault();
		var $list = $('.personal-block .msgs .msg-list');
		if($list.css('opacity') === '0'){
			$list.show().animate({
				right: "-315px",
				opacity: '1'
			}, 350);
		} else {
			$list.animate({
				right: "-160px",
				opacity: '0'
			}, 350, function(){
				$list.hide();
			});
		}
	});
}

function addEventListenerToUploadButton($uploadDom) {
	$uploadButton = $uploadDom.find('.upload-file-button');
	$uploadDom.mouseenter(function() {
		$uploadButton.show();
	});
	$uploadDom.mouseleave(function() {
		$uploadButton.hide();
	});

	$uploadButton.click(function(event) {
		event.preventDefault();
		var avatar = selectAvatarFile(event);
		uploadAvatar(avatar);
	})
}

function saveTags(tagElems){
	var tags = [];
	if(allLengthOK()){
		$(tagElems).toArray().forEach(function(elem){
			tags.push({
				name: $(elem).find('.tag-name-block .tag-name').val(),
				description: $(elem).find('.tag-description').html()
			});
		});
		$.post('/postUserTags', {tags: tags}, function(err){
			if(err){
				throw(err);
			}
		});
	}
}
function allLengthOK(){
	var allOK = true;

	var tagnames = $('.tag-name-block .tag-name').toArray();
	for(var i = 0, len = tagnames.length; i < len; i++){
		if(allOK){
			var text = $(tagnames[i]).val();
			if(text.length > 5 || text.length < 2)
				allOK = false;
		}
	}

	if(allOK){
		var tagdescrs = $('.tag-description').toArray();
		for(var i = 0, len = tagdescrs.length; i < len; i++){
			if(allOK){
				var text = $(tagdescrs[i]).html();
				if(text.length > 20)
					allOK = false;
			}
		}
	}

	return allOK;
}

function saveInfo(infoElem){
	var info = {};
	$(infoElem).toArray().forEach(function(elem){
		info[$(elem).find('.key').data('key')] = $(elem).find('.value').html()
	});
	$.post('/postUserInfo', {info: info}, function(err){
		console.log(err);
		if(err){
			throw(err);
		}
	});
}

function showWarning(elem, text){
	$(elem).html(text);
	$(elem).show();
}
function hideWarning(elem){
	$(elem).hide();
}

function setRead(msg){
	if($(msg).data('read') != 'read'){
		$.get('', {id: $(msg).data('id')}, function(){
			$(msg).data('read', 'read');
		})
	}
}

function selectAvatarFile(event) {
	var avatar = $(event.target).siblings('.select-avatar-file').click();
	return avatar;
}

function uploadAvatar(avatar) {
	// to do 
	// upload the avatar to the server
	// 靠大佬你啦
}

initPersonalBlockEvents();