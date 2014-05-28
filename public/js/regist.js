var emailOK = true,
	passwordOK = false;
	usernameOK = true;

function init(){
	setEvents();
}

function setEvents(){
	// setCheckEmail();
	setCheckoutPassword();
	setSubmitEvent();
}

function setCheckEmail(){
	$('.form-signin .e-mail').blur(function(event){
		var email = $(event.target).val();
		$.post('/checkUserMail', {email: email}, function(result){
			console.log(result);
			switch(result){
			case 'invalid':
				changeClass(event.target, 'success', 'error');
				$(event.target).siblings('.help-inline').html('请输入合法邮箱');
				emailOK = false;
				disableRegistBtn();
				break;
			case 'used':
				changeClass(event.target, 'success', 'error');
				$(event.target).siblings('.help-inline').html('该邮箱已被注册');
				emailOK = false;
				disableRegistBtn();
				break;
			case 'valid':
				changeClass(event.target, 'error', 'success');
				$(event.target).siblings('.help-inline').html('该邮箱可以使用');
				emailOK = true;
				enableRegistBtn();
				break;
			}
		});
	});
}

function setCheckoutPassword(){
	$('.form-signin .re-password').blur(function(event){
		var firstPsd = $('.form-signin .password').val();
		var secondPsd = $('.form-signin .re-password').val();
		console.log(firstPsd);
		if(firstPsd.length > 0 && secondPsd.length > 0 && firstPsd === secondPsd){
			changeClass(event.target, 'error', 'success');
			$(event.target).siblings('.help-inline').html('密码一致');
			passwordOK = true;
			enableRegistBtn();
		} else {
			changeClass(event.target, 'success', 'error');
			$(event.target).siblings('.help-inline').html('密码不一致');
			passwordOK = false;
			disableRegistBtn();
		}
	});
}

function changeClass(target, oldClass, newClass){
	var controlGroup = $(target).parents('.control-group');
	$(controlGroup).removeClass(oldClass);
	$(controlGroup).addClass(newClass);
}

function setSubmitEvent(){
	$('.form-signin').submit(function(event){
		if(!(emailOK && usernameOK && passwordOK)){
			event.preventDefault();
			console.log("error");
		}
	});
}

function disableRegistBtn() {
	console.log($('.form-signin .regist-btn'));
	$('.form-signin .regist-btn').attr("disabled", "disabled");
}

function enableRegistBtn() {
	$('.form-signin .regist-btn').removeAttr("disabled");
}

init();