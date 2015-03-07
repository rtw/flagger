var ws = require("nodejs-websocket")

var games = [];

var newGame = function(id) {
    var Game = {
        redteam: {
            name: 'red',
            players: [
                {
                    x: 50,
                    y: 500
                }
            ]
        },
        blueteam: {
            name: 'blue',
            players: [
                {
                    x: 1150,
                    y: 500
                }
            ]
        },
        bullets: [],
        id:id
    };

    return Game;
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

        if (msg.type == 'connect') {
            var game = findGame(msg.gameid);

            if (!game) {
                game = newGame(msg.gameid);
                games.push(game);
            }
        } else if (msg.type == 'update') {
            var game = findGame(msg.gameid);

            if (!game) return;

            
            if (msg.team == 'red') {
                game.redteam.players[0] = {
                    x: msg.x,
                    y: msg.y
                }
            }

            if (msg.team == 'blue') {
                game.blueteam.players[0] = {
                    x: msg.x,
                    y: msg.y
                }
            }
        }
    });
    
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)


function update() {
    games.forEach(function(game) {
        var msg = JSON.stringify(game);
        server.connections.forEach(function (conn) {
            conn.sendText(msg);
        })
    })
}

setInterval(update, 1000);