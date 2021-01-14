var height = 640;
var width  = 320;
var backgroundSprite;
var playerSprite;
var ammoPool;
var fireTime = 0;

var bombArray;
var spawnEventBomb;

var alienArray;
var spawnEventAlien;
var asteroidSmallArray;
var spawnEventAsteroidSmall;
var asteroidLargeArray;
var spawnEventAsteroidLarge;

var mode;
var modeNum = 1;
var modeText = 'Normal';
var score = 0;
var scoreText;
var playing = false;

var buttonLeft;
var buttonRight;
var buttonFire;
var buttonPlay;
var buttonDifficulty;
var getButton;

var game = new Phaser.Game(width, height, Phaser.AUTO, '', 
                            { 
                                preload: preload, 
                                create: create, 
                                update: update 
                            });

function preload()
{
    // Load all images and assign them a key for reference.
    game.load.image('buttonLeft', 'assets/button_left.png');
    game.load.image('buttonRight', 'assets/button_right.png');
    game.load.image('buttonFire', 'assets/button_fire.png');
    game.load.image('buttonPlay', 'assets/button_play.png');
    game.load.image('backgroundPicture', 'assets/background.png'); 
    game.load.image('ammoSpritesheet', 'assets/sprite_bullet.png');
    game.load.image('asteroidLarge', 'assets/sprite_asteroid_large.png');
    game.load.image('asteroidSmall', 'assets/sprite_asteroid_small.png');
    
    // Load all spritesheets, assign them a key and specify size/number of frames.
    game.load.spritesheet('bombSpritesheet', 'assets/spritesheet_bomb.png', 40, 40, 10);
    game.load.spritesheet('alienSpritesheet', 'assets/spritesheet_alien.png', 40, 40, 45);
    game.load.spritesheet('playerSpritesheet', 'assets/spritesheet_player.png', 80, 120, 8);
    game.load.spritesheet('buttonDifficulty', 'assets/spritesheet_button_difficulty.png', 40, 40, 2);
}

function create()
{
    backgroundSprite = game.add.sprite(0, -height, 'backgroundPicture');
    
    // Load the player's spritesheet, set up it's animation and death event. 
    playerSprite = game.add.sprite(width/2, height-90, 'playerSpritesheet');
    playerSprite.anchor.setTo(0.5, 0.5);
    playerSprite.animations.add('playerAnimation', [0,1,2,3,4,5,6,7]);
    playerSprite.frame = 0;
    playerSprite.play('playerAnimation', 20, true);
    playerSprite.events.onKilled.add(endGame, this);
    
    // Load sprite and create a (maximum number) pool of ammo.
    ammoPool = game.add.group(); 
    ammoPool.createMultiple(10, 'ammoSpritesheet');
    ammoPool.forEach(initialiseAmmoPool, this);
    
    // Load spritesheet and create a (maximum number) group of aliens.
    alienArray = game.add.group();
    alienArray.createMultiple(7, 'alienSpritesheet');
    alienArray.forEach(initialiseAlien, this);
    
    // Load spritesheet and create a (maximum number) group of small asteroids.
    asteroidSmallArray = game.add.group();
    asteroidSmallArray.createMultiple(5, 'asteroidSmall');
    asteroidSmallArray.forEach(initialiseAsteroidSmall, this);
    
     // Load spritesheet and create a (maximum number) group of large asteroids.
    asteroidLargeArray = game.add.group();
    asteroidLargeArray.createMultiple(5, 'asteroidLarge');
    asteroidLargeArray.forEach(initialiseAsteroidLarge, this);
    
    // Load spritesheet and create a (maximum number) group of bombs. 
    bombArray = game.add.group();
    bombArray.createMultiple(1, 'bombSpritesheet');
    bombArray.forEach(initialiseBomb, this);
    
    // Load the difficulty mode and score texts. 
    mode = game.add.text(208, 620, 'MODE: ' + modeText,  {font:'15px MS Gothic Bold', fill:'#ffb3b3'});
    scoreText = game.add.text(5, 620, 'SCORE: ' + score, {font:'15px MS Gothic Bold', fill:'#ffb3b3'});
    
    // Load the mobile buttons.
    buttonLeft = game.add.button(5, 575, 'buttonLeft');
    buttonRight = game.add.button(275, 575, 'buttonRight');
    buttonFire = game.add.button(5, 530, 'buttonFire');
    buttonPlay = game.add.button(width/2-40, height/2, 'buttonPlay'); 
    
    // Assigning a function to a button. 
    buttonDifficulty = game.add.button(5, 5, 'buttonDifficulty', changeDifficulty, this);
    
    // Provide case number for switch function, determining direction of player movement.
    buttonLeft.onInputDown.add(function(){getButton  = 1;});
    buttonRight.onInputDown.add(function(){getButton = 2;});
    buttonLeft.onInputUp.add(function(){getButton    = 3;});
    buttonRight.onInputUp.add(function(){getButton   = 3;});
    
    // Assigning a function to a button, including a parameter to pass. 
    buttonFire.onInputDown.add(shoot, ammoPool);
    
    buttonPlay.onInputDown.add(startGame, this);
}

function startGame() 
{   
    // Once the game has started, hide the play button and show the score. 
    buttonPlay.visible = false;
    
    // Ready Player 1. 
	playing = true;
	playerSprite.revive();
	playerSprite.play('playerAnimation', 20, true);

    spawnAsteroidSmall();
    spawnAsteroidLarge();
    spawnBomb();
    
    // If difficulty is set to normal, spawn aliens. 
    if (modeNum === 1)
        {
            spawnAlien(); 
        }       
}

function update()
{
    if (playing)
        { 
            backgroundSprite.y += 1;

            // Never-ending background!
            if (backgroundSprite.y >= 0)
                {
                    backgroundSprite.y = -height;
                }
            
            // Updating the player movement.
            updatePlayer(playerSprite);

            // Updating the difficulty mode shown as it is changed. 
            mode.text = 'MODE: ' + modeText;
            score += 1;

            // Updating all 'living' (created but not currently being destroyed) ammo, aliens and asteroids. 
            ammoPool.forEachAlive(updateAmmo, this);
            bombArray.forEachAlive(updateBomb, this); 
            alienArray.forEachAlive(updateAlien, this);
            asteroidSmallArray.forEachAlive(updateAsteroidSmall, this);
            asteroidLargeArray.forEachAlive(updateAsteroidLarge, this);

            // Hit checking all 'living' aliens/asteroids/bombs with the player, and ammo with aliens. 
            bombArray.forEachAlive(collisionCheckPlayer, this, playerSprite);
            alienArray.forEachAlive(collisionCheckAlien, this, ammoPool, playerSprite);
            asteroidSmallArray.forEachAlive(collisionCheckPlayer, this, playerSprite);
            asteroidLargeArray.forEachAlive(collisionCheckPlayer, this, playerSprite);

            // Putting a spin on things... 
            asteroidLargeArray.forEachAlive(function(asteroidLargeSprite){asteroidLargeSprite.angle += 0.3}, this)
        }
}

function changeDifficulty(buttonDifficulty)
{
    // If the mode is currently set to normal...
    if (modeNum === 1)
        {
            // ...change the mode to peaceful, update the button image and mode shown.
            buttonDifficulty.frame = 1;
            modeNum = 2; 
            modeText = "Peaceful";
        }
    // Changing it back.
    else if (modeNum === 2)
        {
            buttonDifficulty.frame = 0;
            modeNum = 1; 
            modeText = "Normal";
        }
}

function collisionCheckAlien(alienSprite, ammoPool, playerSprite) 
{
    // Check for all 'living' bullet/alien collisions.
	ammoPool.forEachAlive(collisionCheckBullet, this, alienSprite);
    
    // If the alien is not dead or dying.  
	if (alienSprite.animations.currentFrame.index < 15) 
        {  
            collisionCheckPlayer(playerSprite, alienSprite);
        }
}

function collisionCheckBullet(ammoSpritesheet, alienSprite) 
{
	if (alienSprite.animations.currentFrame.index < 15) 
        {
            if (collisionCheck(ammoSpritesheet, alienSprite)) 
                {
                    // Kill the bullet and alien, update the score and score text.
                    ammoSpritesheet.kill();
                    killAlien(alienSprite);
                    score += 15;
                    scoreText.text = 'Score: '+ score;
                }
        }
}

function collisionCheckPlayer(anotherSprite, playerSprite) 
{
	var hit = collisionCheck(anotherSprite, playerSprite);
    
    // End the game if the player is hit by anything other than a bomb.
	if (hit) 
        {
            // If the player picks up a bomb, explode (bonus boost- wipe screen).
            if (anotherSprite.key === 'bombSpritesheet')
                {
                    explode();
                }
            else
                {
                    playerSprite.kill();
                    endGame();
                } 
        }
}

function collisionCheck(spriteA, spriteB)
{
	var collided = false;
	var xDiff, yDiff;
    
	if (spriteA !== undefined && spriteB !== undefined) 
        {
            xDiff = Math.abs(spriteA.x - spriteB.x);
            yDiff = Math.abs(spriteA.y - spriteB.y);
            if (xDiff+yDiff < 50)
                {
                    collided = true;
                }
        }

	return (collided);
}

function endGame() 
{
	playing = false;
    
    // Clear the screen.
    bombArray.forEachExists(function(bombSprite){bombSprite.kill();}, this);
	alienArray.forEachExists(function(alienSprite){alienSprite.kill();}, this);
	ammoPool.forEachExists(function(ammoSpritesheet){ammoSpritesheet.kill();}, this);
    asteroidSmallArray.forEachExists(function(asteroidSmallSprite){asteroidSmallSprite.kill();}, this);
    asteroidLargeArray.forEachExists(function(asteroidLargeSprite){asteroidLargeSprite.kill();}, this);
    
    // Load the game over alien, then kill him. 
    loadGameOverAlien(width/2, 290);
    alienArray.forEachAlive(killAlien, this);
    
    // Stop spawning things *Doesn't always seem to work, one of the issues I could not resolve.* 
    game.time.events.remove(spawnEventBomb);
    game.time.events.remove(spawnEventAlien);
	game.time.events.remove(spawnEventAsteroidSmall);
    game.time.events.remove(spawnEventAsteroidLarge);
    
    // Load the play button back up. 
    buttonPlay.visible = true;
	buttonPlay.onInputUp.add(startGame, this);
}