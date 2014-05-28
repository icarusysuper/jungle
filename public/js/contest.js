function initContestBlockEvents(){
	$('.contest-block .options .create-team a').click(function(event){
		event.preventDefault();
		initCreateTeamModal();
		$('#create-team-modal').find('input[name="name"]').val($(event.target).parents('.contest-block').find('.contest-title').html());
		$('#create-team-modal').find('input[name="url"]').val($(event.target).parents('.contest-block').find('.contest-detail-link').attr('href'));
		showCreateTeamModal();
	});
}

initContestBlockEvents();