// Using the same functions as the alien.  
function initialiseAsteroidLarge(asteroidLargeSprite) 
{
    asteroidLargeSprite.anchor.setTo(0.5, 0.5);
}

function updateAsteroidLarge(asteroidLargeSprite) 
{
    asteroidLargeSprite.x = asteroidLargeSprite.xLine;
    asteroidLargeSprite.y += asteroidLargeSprite.speed;
    
    if (asteroidLargeSprite.y > height + 20) 
        { 
            asteroidLargeSprite.kill(); 
        }
} 

function spawnAsteroidLarge() 
{
    var cooldownL = 3;
    
    // Create an array of three spawn points in three equally-spaced 'columns'. 
    var spWidthL = 320/6;
    var spawnPointArrayL = [spWidthL-10, spWidthL*3, spWidthL*5+10];
    var spawnPointL = spawnPointArrayL[Math.floor(Math.random() * spawnPointArrayL.length)];
    
    // Spawn large asteroids at intervals. 
    loadAsteroidLarge(spawnPointL, -20);
    spawnEventAsteroidLarge = game.time.events.add(Phaser.Timer.SECOND*cooldownL, spawnAsteroidLarge);
} 

function loadAsteroidLarge(x, y) 
{
    var asteroidLargeSprite = asteroidLargeArray.getFirstExists(false); 
    
    if (asteroidLargeSprite) 
        {
            // Set the asteroid on it's course. 
            asteroidLargeSprite.reset(x, y);
            asteroidLargeSprite.xLine = x;
            asteroidLargeSprite.speed = 2;
        }
}