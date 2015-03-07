Client = {};

Client.start = function(server, gameid) {
  var ws = new WebSocket("ws://" + server);

  ws.onopen = function() {
      $('.connected').text('Connected');
  };

  ws.onmessage = function (evt) { 
      if (!Game.team) return;

      var msg = JSON.parse(evt.data);

      if (Game.team.name == 'red') {
    		  Game.blueteam.players[0].x = msg.blueteam.players[0].x;  	
    		  Game.blueteam.players[0].y = msg.blueteam.players[0].y;
      }

      if (Game.team.name == 'blue') {
          Game.redteam.players[0].x = msg.redteam.players[0].x;   
          Game.redteam.players[0].y = msg.redteam.players[0].y;
      }
  };

  ws.onclose = function() { 
      $('.connected').text('Lost Connection');
  };

  function update() {
      if (!Game.team) return;

      if (Game.team.name == 'red') {
          var data = {team: 'red', x: Game.redteam.players[0].x, y: Game.redteam.players[0].y};
      }

      if (Game.team.name == 'blue') {
          var data = {team: 'blue', x: Game.blueteam.players[0].x, y: Game.blueteam.players[0].y};
      }
  	
      ws.send(JSON.stringify(data));
  }

  setInterval(update, 1000);
}