Crafty.init(1200, 600);
Crafty.background('#000000');

var player1 = Crafty.e('2D, DOM, Color, Multiway, Gravity, Player1')
    .attr({x: 50, y: 500, w: 10, h: 20})
    .color('#FF0000')
    .multiway(2, {W: -90, A: 180, D: 0})
    .gravity("Platform");
player1.alive = true;

var bullet1 = Crafty.e("2D, DOM, Color, Collision, Player1Bullet")
    .color('#FF0000')
    .attr({ x: 50, y: 490, w: 2, h: 2, dx: 5})
    .bind('EnterFrame', function () {
        this.x += this.dx;
    })
    .onHit('Player2', function () {
        if (this.dx == 0)
            this.destroy();

        this.dx = 0;
    });


var team2 = [];
for (var idx = 0; idx < 8; idx ++) {
    var player2 = Crafty.e('2D, DOM, Color, Multiway, Gravity, Player2, Collision')
        .attr({x: 1000 + (idx * 20), y: 500, w: 10, h: 20})
        .color('#0000FF')
        .multiway(2, {UP_ARROW: -90, LEFT_ARROW: 180, RIGHT_ARROW: 0})
        .onHit('Player1Bullet', function () {
            this.alive = false;
            this.h = 10;
            this.w = 20;
            this.multiway(0, {W: -90, A: 180, D: 0})
        })
        .gravity("Platform");
    player2.alive = true;

    team2.push(player2);
}


Crafty.e('2D, DOM, Color, Platform')
    .attr({x: 0, y: 500, w: 1200, h: 100})
    .color('#00FF00');