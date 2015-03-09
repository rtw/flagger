var game = new Phaser.Game(960, 540, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 
var platforms;

var score = 0;
var scoreText;
var btn = {
	right: false,
	left: false,
	up: false
};
var bulletTime = 0;
var dir = 1;

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
	    var ledge = platforms.create(300, game.world.height - 200, 'platform');
	    ledge.body.immovable = true;
	 
	    var ledge = platforms.create(750, game.world.height - 200, 'platform');
	 	ledge.body.immovable = true;   

	 	var ledge = platforms.create(1200, game.world.height - 200, 'platform');
	 	ledge.body.immovable = true;  

	 	var ledge = platforms.create(525, game.world.height - 350, 'platform');
	 	ledge.body.immovable = true;   

	 	var ledge = platforms.create(975, game.world.height - 350, 'platform');
	 	ledge.body.immovable = true;   
    }

    function readyPlayers() {
    	players = game.add.group();

    	// The player and its settings
	    player = players.create(32, game.world.height - 150, 'dude');
	 
	    //  We need to enable physics on the player
	    game.physics.arcade.enable(player);
	 
	    //  Player physics properties. Give the little guy a slight bounce.
	    player.body.bounce.y = 0.2;
	    player.body.gravity.y = 300;
	    player.body.collideWorldBounds = true;
	 
	    //  Our two animations, walking left and right.
	    player.animations.add('left', [0, 1, 2, 3], 10, true);
	    player.animations.add('right', [5, 6, 7, 8], 10, true);

	    player.body.gravity.y = 300;

    	// The player and its settings
	    player2 = players.create(game.world.width - 150, game.world.height - 150, 'dude');
	 
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
    }

    function readyStars() {
    	stars = game.add.group();
 
    	stars.enableBody = true;
	 
	    //  Here we'll create 12 of them evenly spaced apart
	    for (var i = 0; i < 12; i++)
	    {
	        //  Create a star inside of the 'stars' group
	        var star = stars.create(i * 70, 0, 'star');
	 
	        //  Let gravity do its thing
	        star.body.gravity.y = 6;
	 
	        //  This just gives each star a slightly random bounce value
	        star.body.bounce.y = 0.7 + Math.random() * 0.2;
	    }
    }

    function readyGameController() {
    	if (!game.device.desktop) {
	 	
	

			buttonright = game.add.button(200, 400, 'btngreen', function(){});  
	    	buttonright.events.onInputDown.add(function(){btn.right=true});
	    	buttonright.events.onInputUp.add(function(){btn.right=false});

	    	buttonleft = game.add.button(0, 400, 'btngreen', function(){});  
	    	buttonleft.events.onInputDown.add(function(){btn.left=true});
	    	buttonleft.events.onInputUp.add(function(){btn.left=false});

	    	buttonup = game.add.button(100, 300, 'btngreen', function(){});  
	    	buttonup.events.onInputDown.add(function(){btn.up=true});
	    	buttonup.events.onInputUp.add(function(){btn.up=false});

	    	buttondown = game.add.button(100, 500, 'btngreen', function(){});  
	    	buttondown.events.onInputDown.add(function(){btn.down=true});
	    	buttondown.events.onInputUp.add(function(){btn.down=false});
    	}
    }

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'bg');

	// Setup the keyboard for input 
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	game.world.setBounds(0, 0, 1920, 1080);

    readyPlatform();

    readyPlayers();

    readyStars();

	readyGameController();

	bullets = game.add.group();
	bullets.enableBody = true;

	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
    scoreText.fixedToCamera = true;

	game.camera.follow(player);
}
 
function update() {
	function collectStar (player, star) {
        // Removes the star from the screen
	    star.kill();

	    //  Add and update the score
    	score += 10;
    	scoreText.text = 'Score: ' + score;
	}

	function playerHit (player, bullet) {
        // Removes the star from the screen
	    player.kill();
	    bullet.kill();

	    //  Add and update the score
    	score += 10;
    	scoreText.text = 'Score: ' + score;
	}

	function shoot(player) {
		if (game.time.now > bulletTime) {
			
			if (dir > 0) {
				bullet = bullets.create(player.x+30, player.y+20, 'bullet');
				bullet.body.velocity.x = 500;
			} else {
				bullet = bullets.create(player.x-2, player.y+20, 'bullet');
				bullet.body.velocity.x = -500;
			}

			bulletTime = game.time.now + 100;
		}
	}

	//  Collide the player and the stars with the platforms
    game.physics.arcade.collide(players, platforms);

    game.physics.arcade.collide(players, players);
    
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
    }
    else if (cursors.right.isDown || btn.right )
    {
        //  Move to the right
        player.body.velocity.x = 150;
 
        player.animations.play('right');

        dir = 1;
    }
    else
    {
        //  Stand still
        player.animations.stop();
 
        player.frame = 4;
    }

    if (fireButton.isDown) {
    	 shoot(player);
    }
    
    //  Allow the player to jump if they are touching the ground.
    if ((cursors.up.isDown || btn.up) && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}