Crafty.init(1200, 600);
Crafty.background('#000000');

var team1 = [];

var player1 = Crafty.e('2D, DOM, Color, Multiway, Gravity, Player1, Collision, Platform')
    .attr({x: 50, y: 500, w: 10, h: 20})
    .color('#FF0000')
    .multiway(2, {W: -90, A: 180, D: 0})
    .gravity("Platform")
    .gravityConst(0.05)
    .onHit('Player2Bullet', function () {
            this.alive = false;
            this.h = 10;
            this.w = 20;
            this.multiway(0, {W: -90, A: 180, D: 0});
            this.didhit = true;
        })
    .bind('KeyDown', function(e) {
        if(e.key == Crafty.keys.SPACE) {
            fireredbullet(this.x);
        }
    })
player1.alive = true;
team1.push(player1);

var bullets = [];
var fireredbullet = function(x) {
    var bullet = Crafty.e("2D, DOM, Color, Collision, Player1Bullet")
        .color('#FF0000')
        .attr({ x: x, y: 480, w: 2, h: 2, dx: 5})
        .bind('EnterFrame', function () {
            this.x += this.dx;
        })
        .onHit('Player2', function () {
            this.dx = 0;
            this.didhit = true;
        });
    bullets.push(bullet);
}

var firebluebullet = function(x) {
    var bullet = Crafty.e("2D, DOM, Color, Collision, Player2Bullet")
        .color('#FF0000')
        .attr({ x: x, y: 480, w: 2, h: 2, dx: -5})
        .bind('EnterFrame', function () {
            this.x += this.dx;
        })
        .onHit('Player1', function () {
            this.dx = 0;
            this.didhit = true;
        });
    bullets.push(bullet);
}

var team2 = [];
for (var idx = 0; idx < 8; idx ++) {
    var player2 = Crafty.e('2D, DOM, Color, Multiway, Gravity, Player2, Collision, Platform')
        .attr({x: 1000 + (idx * 20), y: 500, w: 10, h: 20})
        .color('#0000FF')
        .multiway(2, {UP_ARROW: -90, LEFT_ARROW: 180, RIGHT_ARROW: 0})
        .onHit('Player1Bullet', function () {
            this.alive = false;
            this.h = 10;
            this.w = 20;
            this.multiway(0, {W: -90, A: 180, D: 0});
            this.didhit = true;
        })
        .bind('KeyDown', function(e) {
            if(e.key == Crafty.keys.SPACE) {
                firebluebullet(this.x);
            }
        })
        .gravity("Platform")
        .gravityConst(0.05);

    player2.alive = true;

    team2.push(player2);
}


Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 0, y: 500, w: 1200, h: 100})
    .color('#00FF00');

Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 200, y: 450, w: 800, h: 2})
    .color('#00FF00');

Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 250, y: 400, w: 600, h: 2})
    .color('#00FF00');

Crafty.e('2D, DOM, Color, Platform, Collision')
    .attr({x: 300, y: 350, w: 500, h: 2})
    .color('#00FF00');


Crafty.e()
    .bind('EnterFrame', function () {
        bullets.forEach(function(item) {
            if (item.didhit) {
                item.destroy();
            }
        });

        team2.forEach(function(item) {
            if (item.didhit) {
                item.destroy();
            }
        }); 

        team1.forEach(function(item) {
            if (item.didhit) {
                item.destroy();
            }
        });      
    })


