function initTeamEvents(){
	$('.team-ops .create-team').click(function(event){
		event.preventDefault();
		initCreateTeamModal();
		showCreateTeamModal();
	});

	$('.team-block .join').click(function(event){
		event.preventDefault();
		$(this).siblings('.msg-writing').toggle(300);
	});

	$('.team-block .msg-writing button').click(function(event){
		event.preventDefault();
		var msg = $(event.target).siblings('input').val();
		if(msg != ''){
			var userId = $(event.target).parents('.team-block').find('.creator').data('id');
			console.log(userId);
			$.post('/postNotification', {userId: userId, msg: msg}, function(result){
				alert('ok');
			});
			$(event.target).siblings('input').val('');
		}
	});
}

initTeamEvents();