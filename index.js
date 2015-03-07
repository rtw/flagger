$(function() {

	var setTeam = function() {
		var team = $('input[name=team]:checked').val();

		if (team == 'red') {
			Game.team = Game.redteam;
		} else {
			Game.team = Game.blueteam;
		}

		Game.player = Game.team.players[0];
	}

	$('input[name=team]').click(function() {
		setTeam();
	});

	$('.reset').click(function() {
		location.href = location.href;
	})

	$('.stop').click(function() {
		Crafty.stop();
	})

	$('.start').click(function() {
		var server = $('.server').val();
		var gameid = $('.gameid').val();

		Game.start(gameid);
		Client.start(server, gameid);

		setTeam();
	})

})