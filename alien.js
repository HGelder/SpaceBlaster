function initialiseAlien(alienSprite) 
{
    // Load the alien spritesheet and set up it's animation. 
    alienSprite.anchor.setTo(0.5, 0.5);
    alienSprite.animations.add('alienAnimation', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
    alienSprite.animations.add('alienDeathAnimation', [15,16,17,18,19,20,21,22,23,24,
                        25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44]);
    alienSprite.frame = 0;
}

function updateAlien(alienSprite) 
{ 
    // SOMETHING HERE!
    alienSprite.x = alienSprite.xLine;
    alienSprite.y += alienSprite.speed;
    
    // Kill any aliens that make it off the screen. 
    if (alienSprite.y > height + 20) 
        {
            alienSprite.kill(); 
        }
} 

function spawnAlien() 
{
    var cooldown = 1;
    
    // Using the midpoint of the screen +/- values, create six paired spawn points.  
    var spWidth = width/2;
    var spawnPointArray = [spWidth-120, spWidth-80, spWidth-20,spWidth+20, spWidth+80, spWidth+120];
    
    // Choose two random spawns...
    var spawnPoint1 = spawnPointArray[Math.floor(Math.random()*spawnPointArray.length)];
    var spawnPoint2 = spawnPointArray[Math.floor(Math.random()*spawnPointArray.length)];
    
    // ...and spawn some aliens, offscreen.
    loadAlien(spawnPoint1, -20);
    loadAlien(spawnPoint2, -20);
 
    // Not too many, add a cooldown.  
    spawnEventAlien = game.time.events.add(Phaser.Timer.SECOND*cooldown, spawnAlien);
} 

function loadAlien(x, y) 
{
    var alienSprite = alienArray.getFirstExists(false); 
    
    if (alienSprite) 
        {
            // When an alien is spawned, set it's course and begin it's animation. 
            alienSprite.frame = 0;
            alienSprite.reset(x, y);
            alienSprite.xLine = x;
            alienSprite.speed = 4;
            alienSprite.play('alienAnimation', 25, true);
        }
}

function loadGameOverAlien(x, y)
{
    var alienSprite = alienArray.getFirstExists(false);
    
    if (alienSprite)
        {
            // Spawn the death alien, doing his death animation. 
            alienSprite.frame = 44;
            alienSprite.reset(x, y);
        }
}

function killAlien(alienSprite)
{
    // When an alien is hit by a bullet, halt them and play their death animation...
    alienSprite.frame = 0;
    alienSprite.speed = 0;
    // ...killing them once finished. 
    alienSprite.play('alienDeathAnimation', 25, false, true);
}