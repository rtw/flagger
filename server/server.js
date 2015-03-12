var ws = require("nodejs-websocket"),
    Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'zKfdnWS1Ym2ooZWi54k0Dvl7P',
  consumer_secret: 'Khn10wdb9qMzqxtyHChdEvfIgoBaMmvYnkxxiK2tn4bzwM9uAN',
  access_token_key: '16461402-Vjf4dv2AShYr7QOe2nEDXRSCD1oEj1XjpBI8dgP14',
  access_token_secret: '4m3jeLZXZ0azC4gCiaM6LsdNI9U6I3kQI4pR8UE5OFNiB'
});
 

var tweetsrun = '';
setInterval(function() { 
    var params = {screen_name: 'nodejs', q: '%23flagger %23game1', result_type:'recent'};
    client.get('search/tweets', params, function(error, tweets, response){
      if (!error) {
        tweets.statuses.forEach(function(item) {
            if (tweetsrun.indexOf(item.id) >= 0) return;

            var bits = item.text.split(' ');

            var code = bits[bits.length - 1];
            
            tweetsrun += item.id;
            if (code == 'starlight') {
                server.connections.forEach(function (conn) {
                    var data = {type:'action', code: 'starlight'};
                    var msg = JSON.stringify(data);
                    conn.sendText(msg);
                })
            }
        });
      }

    });
}, 10000);



var games = [];

var newGame = function(id, redplayers, blueplayers) {

    var game = {
        redteam: {
            name: 'red',
            players: redplayers
        },
        blueteam: {
            name: 'blue',
            players: blueplayers
        },
        id:id
    };

    for (var idx = 0; idx<redplayers.length; idx++) {
        game.redteam.players[idx] = {};
    }

    for (var idx = 0; idx<blueplayers.length; idx++) {
        game.blueteam.players[idx] = {};
    }


    return game;
}

var findGame = function(id) {
    var game;

    games.forEach(function(item) {
        if (item.id == id) {
            game = item;
        }
    })

    return game;
}

var server = ws.createServer(function (conn) {
    console.log("Connection open")
    
    conn.on("text", function (str) {
        var msg = JSON.parse(str);

        if (msg.type == 'newgame') {
            console.log('newgame');
            game = newGame(msg.gameid, msg.redplayers, msg.blueplayers);
            games.push(game);
        } else if (msg.type == 'connect') {
            console.log('connect');
            var game = findGame(msg.gameid);
        } else if (msg.type == 'update') {
            var game = findGame(msg.gameid);
            if (!game) return;

            if (msg.team == 'red') {
                var players = game.redteam.players;
            } else {
                var players = game.blueteam.players;
            }

            players[msg.playernumber].x = msg.x;
            players[msg.playernumber].y = msg.y;
            players[msg.playernumber].dx = msg.dx;
            players[msg.playernumber].direction = msg.direction;
        } else if (msg.type == 'shoot') {
            var game = findGame(msg.gameid);
            if (!game) return;

            server.connections.forEach(function (conn) {
                conn.sendText(JSON.stringify(msg));
            })
        } else if (msg.type == 'score') {
            var game = findGame(msg.gameid);
            if (!game) return;

            server.connections.forEach(function (conn) {
                conn.sendText(JSON.stringify(msg));
            })
        } else if (msg.type == 'hit') {
            var game = findGame(msg.gameid);
            if (!game) return;

            server.connections.forEach(function (conn) {
                conn.sendText(JSON.stringify(msg));
            })
        } else if (msg.type == 'win') {
            console.log('winner ' + msg.team);
            
            var game = findGame(msg.gameid);
            if (!game) return;

            server.connections.forEach(function (conn) {
                conn.sendText(JSON.stringify(msg));
            })
        }

    });
    
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)


function update() {
    games.forEach(function(game) {
        var data = {type:'update', game:game};
        var msg = JSON.stringify(data);
        server.connections.forEach(function (conn) {
            conn.sendText(msg);
        })
    });
}

setInterval(update, 16);