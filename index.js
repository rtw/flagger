$(function() {

	$('input[name=team]').click(function() {
		var team = $('input[name=team]:checked').val();

		if (team == 'red') {
			Game.team = Game.redteam;
		} else {
			Game.team = Game.blueteam;
		}

		Game.player = Game.team.players[0];
	});


	$('.stop').click(function() {
		Crafty.stop();
	})

})