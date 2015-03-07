var ws = require("nodejs-websocket")

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
        team: {},
        id:id
    };

    return Game;
}

var server = ws.createServer(function (conn) {
    console.log("Connection open")
    
    conn.on("text", function (str) {
        var msg = JSON.parse(str);

        if (msg.team == 'red') {
        	Game.redteam.players[0] = {
                x: msg.x,
                y: msg.y
            }
        }

        if (msg.team == 'blue') {
        	Game.blueteam.players[0] = {
                x: msg.x,
                y: msg.y
            }
        }
    });
    
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)


function update() {
    var msg = JSON.stringify(Game);
    server.connections.forEach(function (conn) {
        conn.sendText(msg);
    })
}

setInterval(update, 1000);