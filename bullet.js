function initialiseAmmoPool(ammoSprite) 
{
    ammoSprite.anchor.setTo(0.5, 0.5);
}

function shoot()
{
    var ammoSprite;
    
    // Position the ammo to spawn at the gun tip. 
    var x = playerSprite.x + 10;
    var y = playerSprite.y - 60;
    
    // Take bullets from the pool and fire at intervals. 
    if (game.time.now > fireTime) 
        {
            ammoSprite = ammoPool.getFirstExists(false);
            
            if (ammoSprite)
                {
                    ammoSprite.reset(x, y);
                    fireTime = game.time.now + 350;
                }
        }
}

function updateAmmo(ammoSprite)
{
    ammoSprite.y -= 5; 
    
    if (ammoSprite.y > height)
        {
            ammoSprite.kill();
        }
}