// Using the same functions as the alien and large asteroid. 
function initialiseAsteroidSmall(asteroidSmallSprite) 
{
    asteroidSmallSprite.anchor.setTo(0.5, 0.5);
}

function updateAsteroidSmall(asteroidSmallSprite) 
{
    asteroidSmallSprite.x = asteroidSmallSprite.xLine;
    asteroidSmallSprite.y += asteroidSmallSprite.speed;
    
    if (asteroidSmallSprite.y > height + 20) 
        { 
            asteroidSmallSprite.kill();   
        }
} 

function spawnAsteroidSmall() 
{
    var cooldownS = 2;
    
    // Create an array of three spawn points in three equally-spaced 'columns'.
    var spWidthS = 320/6;
    var spawnPointArrayS = [spWidthS-10, spWidthS*3, spWidthS*5+10];
    var spawnPointS = spawnPointArrayS[Math.floor(Math.random() * spawnPointArrayS.length)];
    
    // Spawn large asteroids at intervals.
    loadAsteroidSmall(spawnPointS, -20);
    spawnEventAsteroidSmall = game.time.events.add(Phaser.Timer.SECOND * cooldownS, spawnAsteroidSmall);
} 

function loadAsteroidSmall(x, y) 
{
    var asteroidSmallSprite = asteroidSmallArray.getFirstExists(false); 
    
    if (asteroidSmallSprite) 
        {
            asteroidSmallSprite.reset(x, y);
            asteroidSmallSprite.xLine = x;
            asteroidSmallSprite.speed = 3;
        }
}