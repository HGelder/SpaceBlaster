// Using the same functions as the alien and asteroids. 
function initialiseBomb(bombSprite)
{
    bombSprite.anchor.setTo(0.5, 0.5);
    bombSprite.animations.add('bombAnimation' [0,1,2,3,4,5,6,7,8,9]);
    bombSprite.frame = 0;
}

function updateBomb(bombSprite)
{
    bombSprite.y += bombSprite.speed;
    
    if (bombSprite.y > height + 20)
        {
            bombSprite.kill();
        }
}

function spawnBomb()
{
    var cooldown = 10;
    
    var spWidthB = width/2;
    var spawnPointArrayB = [spWidthB-120, spWidthB-80, spWidthB-20,spWidthB+20, spWidthB+80, spWidthB+120];
    
    var spawnPointB = spawnPointArrayB[Math.floor(Math.random()*spawnPointArrayB.length)];
    
    loadBomb(spawnPointB, -20);
    
    spawnEventBomb = game.time.events.add(Phaser.Timer.SECOND*cooldown, spawnBomb);
}

function loadBomb(x, y)
{
    var bombSprite = bombArray.getFirstExists(false); 
    
    if (bombSprite) 
        {
            bombSprite.frame = 0;
            bombSprite.reset(x, y);
            bombSprite.speed = 3;
            bombSprite.play('bombAnimation', 20, true);
        }
}

function explode()
{
    // Wipe screen and add to score for each alien destroyed. 
    bombArray.forEachExists(function(bombSprite){bombSprite.kill();}, this);

    alienArray.forEachExists(function(){score +=15;}, this);
    
	alienArray.forEachExists(function(alienSprite){alienSprite.kill();}, this);
	ammoPool.forEachExists(function(ammoSpritesheet){ammoSpritesheet.kill();}, this);
    asteroidSmallArray.forEachExists(function(asteroidSmallSprite){asteroidSmallSprite.kill();}, this);
    asteroidLargeArray.forEachExists(function(asteroidLargeSprite){asteroidLargeSprite.kill();}, this);
}
