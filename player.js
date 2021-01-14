function updatePlayer(playerSprite)
{
    // Retrieve the button case number from the button callback functions.  
    switch(getButton)
    {
        // If the left button is pressed.
        case 1: playerSprite.x -=  4;
            
                // Move left but not off the screen. 
                if (playerSprite.x < 40)
                    {
                        playerSprite.x = 40;
                    }
        break;
        
        // If the right button is pressed.
        case 2: playerSprite.x += 4;
            
                // Move right but not off the screen. 
                if (playerSprite.x > width - 40)
                    {
                        playerSprite.x = width - 40;
                    }
        break;
         
        // If no buttons are being pressed, do nothing.
        // Otherwise it registers as all buttons always being pressed. 
        case 3: 
        break;
    }
}
