Client = {};
var ws

Client.firebullet = function(team, x, y, dx) {
    var data = {gameid: Client.gameid, type:'bullet', team:team, x:x, y:y, dx:dx}
    ws.send(JSON.stringify(data));
}

Client.start = function(server, gameid) {
  Client.gameid = gameid;
  ws = new WebSocket("ws://" + server);

  ws.onopen = function() {
      $('.connected').text('Connected');

      var data = {type:'connect', gameid: gameid}
      ws.send(JSON.stringify(data));
  };

  var lasttime = new Date().getTime();

  ws.onmessage = function (evt) { 
      var thistime = new Date().getTime();
      var ping = thistime - lasttime;
      lasttime = thistime;

      $('.ping').html(ping);

      if (!Game.team) return;

      var msg = JSON.parse(evt.data);

      if (msg.type == 'update') {
          if (Game.team.name == 'red') {
        		  Game.blueteam.players[0].x = msg.game.blueteam.players[0].x;  	
        		  Game.blueteam.players[0].y = msg.game.blueteam.players[0].y;
          }

          if (Game.team.name == 'blue') {
              Game.redteam.players[0].x = msg.game.redteam.players[0].x;   
              Game.redteam.players[0].y = msg.game.redteam.players[0].y;
          }

          update();
      } else if (msg.type == 'bullet') {
          if (msg.team == 'red') {
              Game.fireredbullet(msg.x, msg.y, msg.dx);
          } else {
              Game.firebluebullet(msg.x, msg.y, msg.dx);
          }
      }
  };

  ws.onclose = function() { 
      $('.connected').text('Lost Connection');
  };

  function update() {
      if (!Game.team) return;

      if (Game.team.name == 'red') {
          var data = {gameid: gameid, type:'update', team: 'red', x: Game.redteam.players[0].x, y: Game.redteam.players[0].y};
      }

      if (Game.team.name == 'blue') {
          var data = {gameid: gameid, type:'update', team: 'blue', x: Game.blueteam.players[0].x, y: Game.blueteam.players[0].y};
      }
  	
      ws.send(JSON.stringify(data));
  }
}