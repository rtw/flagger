var game = new Phaser.Game(960, 540, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
var platforms,
	players,
	stars,
	bullets;

var redScoreText,
	blueScoreText,
	wintext;

var btn = {
	right: false,
	left: false,
	up: false
};


var	team,
	player;

var score = {
		red:0,
		blue:0
	},	
	teams = {
		red: {
			numberOfPlayers: 1,
			players:[]
		},
		blue: {
			numberOfPlayers: 1,
			players:[]
		}
	};

var bulletTime = 0,
	dir = 1,
	dx = 0;
	

	
	

function preload() {
	game.load.image('bg', 'assets/bg.png');
	game.load.image('btngreen', 'assets/btn-green.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}

function create() {

    function readyPlatform() {
    	//  The platforms group contains the ground and the 2 ledges we can jump on
	    platforms = game.add.group();
	 
	    //  We will enable physics for any object that is created in this group
	    platforms.enableBody = true;
	 
	    // Here we create the ground.
	    var ground = platforms.create(0, game.world.height - 64, 'ground');
	 
	    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
	    ground.scale.setTo(2, 2);
	 
	    //  This stops it from falling away when you jump on it
	    ground.body.immovable = true;
	 
	    //  Now let's create two ledges
	    var ledge = platforms.create(300, game.world.height - 150, 'platform');
	    ledge.body.immovable = true;
	 
	    var ledge = platforms.create(750, game.world.height - 150, 'platform');
	 	ledge.body.immovable = true;   

	 	var ledge = platforms.create(1200, game.world.height - 150, 'platform');
	 	ledge.body.immovable = true;  

	 	var ledge = platforms.create(525, game.world.height - 250, 'platform');
	 	ledge.body.immovable = true;   

	 	var ledge = platforms.create(975, game.world.height - 250, 'platform');
	 	ledge.body.immovable = true;   
    }

    function readyPlayers() {
    	players = game.add.group();

    	// The player and its settings
	    player1 = players.create(32, 968, 'dude');
	 
	    //  We need to enable physics on the player
	    game.physics.arcade.enable(player1);
	 
	    //  Player physics properties. Give the little guy a slight bounce.
	    player1.body.bounce.y = 0.2;
	    player1.body.gravity.y = 300;
	    player1.body.collideWorldBounds = true;
	 
	    //  Our two animations, walking left and right.
	    player1.animations.add('left', [0, 1, 2, 3], 10, true);
	    player1.animations.add('right', [5, 6, 7, 8], 10, true);

	    player1.body.gravity.y = 300;
	    player1.team = 'red';

    	// The player and its settings
	    player2 = players.create(1770, 968, 'dude');
	 
	    //  We need to enable physics on the player
	    game.physics.arcade.enable(player2);
	 
	    //  Player2 physics properties. Give the little guy a slight bounce.
	    player2.body.bounce.y = 0.2;
	    player2.body.gravity.y = 300;
	    player2.body.collideWorldBounds = true;
	 
	    //  Our two animations, walking left and right.
	    player2.animations.add('left', [0, 1, 2, 3], 10, true);
	    player2.animations.add('right', [5, 6, 7, 8], 10, true);

	    player2.body.gravity.y = 300;
	    player2.team = 'blue';

	    teams.red.players.push(player1);
	    teams.blue.players.push(player2);
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

    function readyScoreText() {
    	redScoreText = game.add.text(16, 16, 'Red: 0', { fontSize: '32px', fill: '#FFF' });
	    redScoreText.fixedToCamera = true;

	    blueScoreText = game.add.text(830, 16, 'Blue: 0', { fontSize: '32px', fill: '#FFF' });
	    blueScoreText.fixedToCamera = true;
    }

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.world.setBounds(0, 0, 1920, 1080);

    //  A simple background for our game
    game.add.sprite(0, 0, 'bg');


	// Setup the keyboard for input 
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    readyPlatform();

	readyGameController();

	stars = game.add.group();
   	stars.enableBody = true;

	bullets = game.add.group();
	bullets.enableBody = true;

	readyScoreText();

    readyWinText();


    var teamname = getParameterByName('team') || 'red';
    team = teams[teamname];

	teams.red.numberOfPlayers = getParameterByName('red') || 1;
	teams.blue.numberOfPlayers = getParameterByName('blue') || 1;
	readyPlayers();

	var playernumber = getParameterByName('player') || 0;

	player = team.players[playernumber];

	game.camera.follow(player);



	var server = getParameterByName('server');
	var gameid = getParameterByName('gameid');

	Client.start(server, gameid);
}
 
function update() {
	function collectStar (player, star) {
        // Removes the star from the screen
	    star.kill();

	    //  Add and update the score
	    if (player.team == 'red' && team == 'red') {
	    	score.red += 10;
	    	Client.updateScore('red', score.red);
	    	redScoreText.text = 'Red: ' + score.red;
	    } 

	    if (player.team == 'blue' && team == 'blue') {
	    	score.blue += 10;
	    	Client.updateScore('blue', score.blue);
	    	blueScoreText.text = 'Blue: ' + score.blue;
	    }
	}

	function playerHit (player, bullet) {
		if (player.team == team) return;

		Client.playerHit(player.team);

		hit(player, bullet);
	}

	//  Collide the player and the stars with the platforms
    game.physics.arcade.collide(players, platforms);
    
    game.physics.arcade.collide(stars, platforms);

    game.physics.arcade.overlap(players, stars, collectStar, null, this);

    game.physics.arcade.overlap(players, bullets, playerHit, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
 
    if (cursors.left.isDown || btn.left)
    {
        //  Move to the left
        player.body.velocity.x = -150;
 
        player.animations.play('left');

        dir = -1;
        dx = -1;
    }
    else if (cursors.right.isDown || btn.right )
    {
        //  Move to the right
        player.body.velocity.x = 150;
 
        player.animations.play('right');

        dir = 1;
        dx = 1;
    }
    else
    {
        //  Stand still
        player.animations.stop();
 
        player.frame = 4;
		dx = 0;
    }

    if (fireButton.isDown || btn.shoot) {
    	 shoot(player, dir, true);
    }
    
    //  Allow the player to jump if they are touching the ground.
    if ((cursors.up.isDown || btn.up) && player.body.touching.down)
    {
        player.body.velocity.y = -250;
    }
}





function readyStars() {
   	//  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 27; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 500, 'star');
 
        //  Let gravity do its thing
        star.body.gravity.y = 6;
 
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
}

function shoot(player, bulletdir, relay) {
	if (relay && game.time.now < bulletTime) {
		return;
	}

	if (bulletdir > 0) {
		bullet = bullets.create(player.x+30, player.y+20, 'bullet');
		bullet.body.velocity.x = 500;
	} else {
		bullet = bullets.create(player.x-2, player.y+20, 'bullet');
		bullet.body.velocity.x = -500;
	}

	bulletTime = game.time.now + 100;

	if (relay) {
		Client.shoot(team, bulletdir);
	}
}

function hit(player, bullet) {
	// Removes the star from the screen
    player.kill();

    if (bullet) {
    	bullet.kill();
	}

    //  Add and update the score
	if (player.team == 'blue' && team == 'red') {
    	score.red += 50;
    	Client.updateScore('red', score.red);
    	redScoreText.text = 'Red: ' + score.red;
    } 

    if (player.team == 'red' && team == 'blue') {
    	score.blue += 50;
    	Client.updateScore('blue', score.blue);
    	blueScoreText.text = 'Blue: ' + score.blue;
    }

    var win = false;
    if (player.team != team) {
    	if (player.team == 'blue') {
    		wintext.text = 'Red Wins!';
    		wintext.fill = '#ff0000';
    	} else {
    		wintext.text = 'Blue Wins!'
    		wintext.fill = '#0000ff';
    	}
    } else {
    	if (player.team == 'red') {
    		wintext.text = 'Blue Wins!';
    		wintext.fill = '#0000ff';
    	} else {
    		wintext.text = 'Red Wins!';
    		wintext.fill = '#ff0000';
    	}
    }

    game.paused = true;
}