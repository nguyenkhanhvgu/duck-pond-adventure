# Duck Game Assets

This directory contains the game assets for Duck Pond Adventure.

## Images
- `duck-icon.png` - Favicon for the game
- `duck-preview.png` - Preview image for social sharing
- `duck.png` - Duck character sprite (optional, game uses canvas drawing)
- `pond-bg.png` - Pond background image (optional, game uses canvas drawing)
- `collectibles.png` - Collectible items sprite sheet (optional)

## Sounds
- `quack.mp3` - Duck movement sound
- `collect.mp3` - Item collection sound
- `start.mp3` - Game start sound

## Notes
The current game implementation draws all graphics using HTML5 Canvas, so image assets are optional. However, you can replace the canvas drawing with actual image sprites by modifying the rendering methods in `game.js`.

To add actual images:
1. Place your image files in this directory
2. Load them in the game constructor
3. Update the drawing methods to use `drawImage()` instead of canvas shapes

Example:
```javascript
// In constructor
this.images = {
    duck: new Image(),
    background: new Image()
};
this.images.duck.src = 'assets/images/duck.png';
this.images.background.src = 'assets/images/pond-bg.png';

// In render method
this.ctx.drawImage(this.images.duck, this.duck.x, this.duck.y);
```
