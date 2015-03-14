var game = new Phaser.Game(960, 540, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
var platforms,
	redplayers,
	blueplayers,
	teamplayers,
	boxes,
	redbullets,
	bluebullets;

var redScoreText,
	blueScoreText,
	wintext;

var btn = {
	right: false,
	left: false,
	up: false
};


var	team,
	playernumber,
	player,
	gameid;

var score = {
		red:0,
		blue:0
	},	
	teams = {
		red: {
			name: 'red',
			numberOfPlayers: 1,
			players:[]
		},
		blue: {
			name: 'blue',
			numberOfPlayers: 1,
			players:[]
		}
	};

var bulletTime = 0;
	

function preload() {
	game.load.image('bg', 'assets/bg.png');
	game.load.image('btngreen', 'assets/btn-green.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('box', 'assets/box.png');

    game.load.spritesheet('red', 'assets/dude.png', 49, 60);
    game.load.spritesheet('blue', 'assets/dude.png', 49, 60);
	
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}

function create() {

    function readyPlatform() {
	    platforms = game.add.group();
	    platforms.enableBody = true;

	    var ground = platforms.create(0, game.world.height - 130, 'ground');
	    ground.scale.setTo(2, 2);
	    ground.body.immovable = true; 
    }

    function readyPlayers() {
    	function createPlayer(players, teamname, x, y) {
    		var player = players.create(x, y, teamname);
	 		
	 		//  We need to enable physics on the player
    		game.physics.arcade.enable(player);

	 		//  Our two animations, walking left and right.
		    player.animations.add('left', [0, 1, 2, 3,], 10, true);
		    player.animations.add('right', [5, 6, 7, 8,], 10, true);

		    player.teamname = teamname;
			player.direction = 1;
			player.health = 100;
			player.shield = 100;

		    player.body.bounce.y = 0.1;
		    player.body.gravity.y = 760 ;
		    player.body.collideWorldBounds = true;
		    
		    player.moveLeft = function() {
		    	player.body.velocity.x = -300;
 				player.animations.play('left');

        		player.direction = -1;
        		player.dx = -1;
		    }

		    player.moveRight = function() {
		    	player.body.velocity.x = 300;
 				player.animations.play('right');

        		player.direction = 1;
        		player.dx = 1;
		    }

		    player.moveStop = function() {
				player.animations.stop();
 
        		player.frame = 4;
				player.dx = 0;
		    }

		    return player;
    	}

    	redplayers = game.add.group();
    	blueplayers = game.add.group();

    	for (var idx = 0; idx < teams.red.numberOfPlayers; idx ++) {
    		teams.red.players.push(createPlayer(redplayers, 'red', idx*30 + 32, 800));
    	}

    	for (var idx = 0; idx < teams.blue.numberOfPlayers; idx ++) {
    		teams.blue.players.push(createPlayer(blueplayers, 'blue', idx*30 + 1770, 800));
    	}
    }

    function readyGameController() {
    	if (!game.device.desktop) {
	 		var buttonright = game.add.button(125, 200, 'btngreen', function(){});  
	    	buttonright.events.onInputDown.add(function(){btn.right=true});
	    	buttonright.events.onInputUp.add(function(){btn.right=false});
	    	buttonright.fixedToCamera = true;

	    	var buttonleft = game.add.button(25, 200, 'btngreen', function(){});  
	    	buttonleft.events.onInputDown.add(function(){btn.left=true});
	    	buttonleft.events.onInputUp.add(function(){btn.left=false});
	    	buttonleft.fixedToCamera = true;

	    	var buttonup = game.add.button(875, 125, 'btngreen', function(){});  
	    	buttonup.events.onInputDown.add(function(){btn.up=true});
	    	buttonup.events.onInputUp.add(function(){btn.up=false});
	    	buttonup.fixedToCamera = true;

	    	var buttonshoot = game.add.button(875, 225, 'btngreen', function(){});  
	    	buttonshoot.events.onInputDown.add(function(){btn.shoot=true});
	    	buttonshoot.events.onInputUp.add(function(){btn.shoot=false});
	    	buttonshoot.fixedToCamera = true;
    	}
    }

    function readyWinText() {
    	wintext = game.add.text(500, 250, '');
	    wintext.anchor.set(0.5);
	    wintext.align = 'center';

	    wintext.font = 'Arial Black';
	    wintext.fontSize = 70;
	    wintext.fontWeight = 'bold';

	    wintext.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
	    wintext.fixedToCamera = true;
    }

    function readyBoxes() {
    	boxes = game.add.group();
		boxes.enableBody = true;

		var box1 = boxes.create(500, 910, 'box');
		box1.body.immovable = true;

		var box2 = boxes.create(550, 912, 'box');
		box2.body.immovable = true;
    }

    function startServer() {
    	var server = getParameterByName('server');
		gameid = getParameterByName('gameid');
		var connect = getParameterByName('connect');

		Client.start(server, function() {
			if (!connect) {
				var initredplayers = [], initblueplayers = [];
				teams.red.players.forEach(function(item) {
					initredplayers.push({
						x: item.x,
						y: item.y,
						direction: item.direction
					})
				});
				teams.blue.players.forEach(function(item) {
					initblueplayers.push({
						x: item.x,
						y: item.y,
						direction: item.direction
					})
				});

				var gamename = getParameterByName('gamename');
				Client.newGame(gameid, gamename, initredplayers, initblueplayers);
			} else {
				Client.connect(gameid);
			}
		});
    }

    game.state.disableVisibilityChange = true;

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.world.setBounds(0, 0, 3072, 1080);

    //  A simple background for our game
    game.add.sprite(0, 0, 'bg');

	// Setup the keyboard for input 
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    readyPlatform();

	readyGameController();
	
	readyBoxes();

	redbullets = game.add.group();
	redbullets.enableBody = true;

	bluebullets = game.add.group();
	bluebullets.enableBody = true;

    readyWinText();

    var teamname = getParameterByName('team') || 'red';
    team = teams[teamname];

	teams.red.numberOfPlayers = getParameterByName('red') || 1;
	teams.blue.numberOfPlayers = getParameterByName('blue') || 1;
	readyPlayers();

	playernumber = getParameterByName('player') || 0;

	player = team.players[playernumber];

	game.camera.follow(player);

	startServer();
}
 
function update() {
	function playerHit (player, bullet) {
		Client.playerHit(player.teamname);
		hit(player, bullet);
	}

	game.physics.arcade.collide(blueplayers, blueplayers);
	game.physics.arcade.collide(redplayers, blueplayers);
	game.physics.arcade.collide(redplayers, redplayers);

	game.physics.arcade.collide(redplayers, platforms);
    game.physics.arcade.collide(blueplayers, platforms);
    game.physics.arcade.collide(boxes, platforms);

    
    game.physics.arcade.collide(redplayers, boxes);
	game.physics.arcade.collide(blueplayers, boxes);
    
    game.physics.arcade.overlap(boxes, redbullets, boxHit, null, this);
    game.physics.arcade.overlap(boxes, bluebullets, boxHit, null, this);
    game.physics.arcade.overlap(redplayers, bluebullets, playerHit, null, this);
    game.physics.arcade.overlap(blueplayers, redbullets, playerHit, null, this);


    // Move Player
    player.body.velocity.x = 0;
 
    if (cursors.left.isDown || btn.left) {
    	player.moveLeft();
    } else if (cursors.right.isDown || btn.right ) {
        player.moveRight();
    } else {
        player.moveStop();
    }

    if (fireButton.isDown || btn.shoot) {
    	 shoot(player, player.direction, true);
    }
    
    if ((cursors.up.isDown || btn.up)) {
    	if (player.body.touching.down && !player.jump) {
    		player.jump = true;
        	player.body.velocity.y = -250;
        }
    } else {
    	player.jump = false;
    }
}

function boxHit(box, bullet) {
	bullet.kill();
}	

function shoot(bulletplayer, bulletdir, relay) {
	if (relay && game.time.now < bulletTime) {
		return;
	}

	if (!relay && bulletplayer == player) {
		return;
	}
	
	if (bulletplayer.teamname == 'red') {
		var bullets = redbullets;
		console.log('redbullet');
	} else {
		var bullets = bluebullets;
		console.log('bluebullet');
	}

	if (bulletdir > 0) {
		var bullet = bullets.create(bulletplayer.x-120, bulletplayer.y+1, 'bullet');
		bullet.body.velocity.x = 500;
	} else {
		var bullet = bullets.create(bulletplayer.x-180, bulletplayer.y+1, 'bullet');
		bullet.body.velocity.x = -500;
	}

	bulletTime = game.time.now +400;

	if (relay) {
		Client.shoot(team.name, bulletdir, playernumber);
	}
}

function hit(hitplayer, bullet) {
	bullet.kill();
    
    if (hitplayer.shield > 0) {
		hitplayer.shield -= 50;

		if (hitplayer.shield >= 0) return;
    }

    if (hitplayer.health > 0) {
    	hitplayer.health -= 50;

    	if (hitplayer.health >= 0) return;
    }

    hitplayer.killed = true;
    hitplayer.kill();
	
    // only win when all other team players are dead
    var win = true;
    var hitteam = teams[hitplayer.teamname];
    for(var idx=0; idx < hitteam.players.length; idx ++) {
    	if (!hitteam.players[idx].killed) {
    		win = false;
    	}
    }

    if (win) {
	    if (hitplayer.teamname != team) {
	    	if (hitplayer.teamname == 'blue') {
	    		gameover('red', true);
	    	} else {
	    		gameover('blue', true);
	    	}
	    } else {
	    	if (hitplayer.teamname == 'red') {
	    		gameover('blue', true);
	    	} else {
	    		gameover('red', true);
	    	}
	    }
	}
}

function gameover(winningteam, relay) {
	if (relay) {
		Client.win(winningteam);
	}

	wintext.text = winningteam + ' Wins!';
	if (winningteam == 'red')
   		wintext.fill = '#ff0000'
   	else 
   		wintext.fill = '#0000ff'

    game.paused = true;
}