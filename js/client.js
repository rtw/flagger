Client = {};
var ws;

connected = false;

Client.playerHit = function(team) {
    if (!connected) return;

    var data = {gameid: Client.gameid, type:'hit', team:team}
    ws.send(JSON.stringify(data));
}

Client.shoot = function(team, dir) {
    if (!connected) return;

    var data = {gameid: Client.gameid, type:'shoot', team:team, dir:dir}
    ws.send(JSON.stringify(data));
}

Client.updateScore = function(team, score) {
    if (!connected) return;

    var data = {gameid: Client.gameid, type:'score', team:team, score:score}
    ws.send(JSON.stringify(data));
}

Client.newGame = function(gameid, redplayers, blueplayers) {
    if (!connected) return;

    var data = {type:'newgame', gameid: gameid, redplayers: redplayers, blueplayers: blueplayers}
    ws.send(JSON.stringify(data));
}

Client.connect = function(gameid) {
    if (!connected) return;

    var data = {type:'connect', gameid: gameid}
    ws.send(JSON.stringify(data));
}

Client.start = function(server, callback) {
  ws = new WebSocket("ws://" + server);

  ws.onopen = function() {
      console.log('connected');
      connected = true;
      callback();
  };

  var lasttime = new Date().getTime();

  ws.onmessage = function (evt) { 
      var thistime = new Date().getTime();
      ping = thistime - lasttime;
      lasttime = thistime;

      var msg = JSON.parse(evt.data);

      if (msg.type == 'update') {
          if (team == 'red') {
              var bluemsg = msg.game.blueteam.players[0];
              var blueplayer = teams.blue.players[0];

              if (bluemsg.dx != blueplayer.dx) {
                if (bluemsg.dx == 1) {
                    blueplayer.animations.play('right');
                } else if (bluemsg.dx == -1) {
                    blueplayer.animations.play('left');
                } else {
                    blueplayer.animations.stop();
                    blueplayer.frame = 4;
                }
                blueplayer.dx = bluemsg.dx;
              }

        		  blueplayer.x = bluemsg.x;  	
        		  blueplayer.y = bluemsg.y;
          }

          if (team == 'blue') {
              var redmsg = msg.game.redteam.players[0];
              var redplayer = teams.red.players[0];
              
              if (redmsg.dx != redplayer.dx) {
                if (redmsg.dx == 1) {
                    redplayer.animations.play('right');
                } else if (redmsg.dx == -1) {
                    redplayer.animations.play('left');
                } else {
                    redplayer.animations.stop();
                    redplayer.frame = 4;
                }
                redplayer.dx = redmsg.dx;
              }

              redplayer.x = redmsg.x;   
              redplayer.y = redmsg.y;
          }
      } else if (msg.type == 'shoot') {
          if (msg.team == 'red' && team == 'blue') {
              shoot(teams.red.players[0], msg.dir, false);
          } 
          if (msg.team == 'blue' && team == 'red') {
              shoot(teams.blue.players[0], msg.dir, false);
          }
      } else if (msg.type == 'score') {
          if (msg.team == 'red') {
              score.red = msg.score;
              redScoreText.text = 'Red: ' + score.red;
          } else {
              score.blue = msg.score;
              blueScoreText.text = 'Blue: ' + score.blue;
          }
      } else if (msg.type == 'hit') {
          if (msg.team == 'red' && team == 'red') {
              hit(teams.red.players[0]);
          } 
          if (msg.team == 'blue' && team == 'blue') {
              hit(teams.blue.players[0]);
          }
      } else if (msg.type == 'action') {
        if (msg.code == 'starlight') {
          readyStars();
        }
      }
    };

    ws.onclose = function() { 
        console.log('lost connection');
        connected = false;
        callback();
    };
}

function update() {
    if (connected) {
        if (team == 'red') {
            var data = {
                gameid: gameid, 
                type:'update', 
                team: 'red', 
                players: teams.red.players
            };
        }

        if (team == 'blue') {
            var data = {
                gameid: gameid, 
                type:'update', 
                team: 'blue', 
                players: teams.red.players
            };
        }
    
        ws.send(JSON.stringify(data));

        setTimeout(update, 16);
    };
}