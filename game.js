Game = {
    redteam: {
        name: 'red',
        players: []
    },
    blueteam: {
        name: 'blue',
        players: []
    },
    bullets: [],
    team: {},
    player: {}
};

Crafty.init(1200, 600);
Crafty.background('#FFFFFF');

for (var idx = 0; idx < 1; idx ++) {
    var player1 = Crafty.e('2D, DOM, Color, Multiway, Gravity, Player1, Collision, Platform')
        .attr({x: 50 + idx * 20, y: 500, w: 10, h: 20, dx:0})
        .color('#FF0000')
        .gravity("Platform")
        .gravityConst(0.05)
        .onHit('Player2Bullet', function () {
                this.alive = false;
            })
        .bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.E) {
                fireredbullet(this.x, this.y);
            }
        })
        .bind('EnterFrame', function () {
            this.x += this.dx;
        });

    player1.alive = true;

    Game.redteam.players.push(player1);
}
var fireredbullet = function(x, y) {
    var bullet = Crafty.e("2D, DOM, Color, Collision, Player1Bullet")
        .color('#FF0000')
        .attr({ x: x, y: y, w: 2, h: 2, dx: 5})
        .bind('EnterFrame', function () {
            this.x += this.dx;
        })
        .onHit('Player2', function () {
            this.dx = 0;
            this.didhit = true;
        });
    Game.bullets.push(bullet);
}

for (var idx = 0; idx < 1; idx ++) {
    var player2 = Crafty.e('2D, DOM, Color, Multiway, Gravity, Player2, Collision, Platform')
        .attr({x: 1150 + (idx * 20), y: 500, w: 10, h: 20, dx:0})
        .color('#0000FF')
        .gravity("Platform")
        .gravityConst(0.05)
        .onHit('Player1Bullet', function () {
            this.alive = false;
        })
        .bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.SPACE) {
                firebluebullet(this.x, this.y);
            }
        })
        .bind('EnterFrame', function () {
            this.x += this.dx;
        });

    player2.alive = true;
    
    Game.blueteam.players.push(player2);
}
var firebluebullet = function(x, y) {
    var bullet = Crafty.e("2D, DOM, Color, Collision, Player2Bullet")
        .color('#0000FF')
        .attr({ x: x, y: y, w: 2, h: 2, dx: -5})
        .bind('EnterFrame', function () {
            this.x += this.dx;
        })
        .onHit('Player1', function () {
            this.dx = 0;
            this.didhit = true;
        });
    Game.bullets.push(bullet);
}


Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 0, y: 500, w: 1200, h: 100})
    .color('#00FF00');

Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 200, y: 450, w: 600, h: 2})
    .color('#00FF00');

Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 250, y: 400, w: 500, h: 2})
    .color('#00FF00');

Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 300, y: 350, w: 400, h: 2})
    .color('#00FF00');


Crafty.e()
    .bind('KeyDown', function(e) {
        if(e.key == Crafty.keys.LEFT_ARROW) {
            Game.player.dx = -1;
        } else if (e.key == Crafty.keys.RIGHT_ARROW) {
            Game.player.dx = 1;
        } else if (e.key == Crafty.keys.UP_ARROW) {
            Game.player.y = Game.player.y-1;
        } 
      })
    .bind('KeyUp', function(e) {
        Game.player.dx = 0;
      })
    .bind('EnterFrame', function () {
        var follow = Game.team.players[0];

        var x = follow.x;
        if (x < 300) { 
            x = 0; 
        } else if (x > 900) { 
            x = -600; 
        } else { 
            x = -1 * (follow.x - 300);
        }
        
        Crafty.viewport.scroll('_x', x);
        Crafty.viewport.scroll('_y', -1 * (follow.y / 2));

        Game.bullets.forEach(function(item) {
            if (item.didhit) {
                item.destroy();
            }
        });

        Game.blueteam.players.forEach(function(item) {
            if (item.alive != true) {
                item.destroy();

                alert('Red Wins');
                Crafty.stop();
            }

            if (item.x < 0) {
                alert('Blue Wins');
                Crafty.stop();
            }
        }); 

        Game.redteam.players.forEach(function(item) {
            if (item.alive != true) {
                item.destroy();

                alert('Blue Wins');
                Crafty.stop();
            }

            if (item.x > 1200) {
                alert('Red Wins');
                Crafty.stop();
            }
        });  


    })


Crafty.viewport.scale(2);
Crafty.viewport.scroll('_x', 0);
Crafty.viewport.scroll('_y', -202);

Game.team = Game.redteam;
Game.player = Game.team.players[0];