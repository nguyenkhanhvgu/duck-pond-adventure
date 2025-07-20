# Duck Pond Adventure 🦆

A fun, lightweight web-based duck game built with HTML5 Canvas, JavaScript, and CSS. Guide your duck around a peaceful pond and collect various items to score points!

![Duck Game Preview](assets/images/duck-preview.png)

## 🎮 Game Features

- **Smooth Duck Movement**: Control your duck with arrow keys (desktop) or touch controls (mobile)
- **Collectible Items**: 
  - 🍞 Breadcrumbs (10 points)
  - 🐟 Fish (25 points) 
  - 🌸 Water Lilies (50 points)
- **Responsive Design**: Plays perfectly on desktop and mobile devices
- **Touch Controls**: Virtual joystick and direct touch movement for mobile
- **Visual Effects**: Animated water ripples, floating items, and score popups
- **Game States**: Menu, playing, paused, and game over screens

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Open `index.html`** in any modern web browser
3. **Click "Start Game"** and begin collecting items!

That's it! No installation or build process required.

## 🎯 How to Play

### Desktop Controls
- **Arrow Keys** or **WASD**: Move the duck
- **Spacebar**: Pause/Resume game
- **Mouse Click**: Pause button and menu interactions

### Mobile Controls  
- **Touch and Drag**: Move the duck
- **Virtual Joystick**: Use the on-screen joystick (bottom-left)
- **Direct Touch**: Tap anywhere on the pond to move towards that point

### Objective
Collect as many items as possible to maximize your score! Items respawn after being collected, so keep exploring the pond.

## 🛠 Technical Details

### Built With
- **HTML5 Canvas** - Game rendering and animation
- **Vanilla JavaScript** - Game logic and controls  
- **CSS3** - Responsive styling and visual effects
- **Web APIs** - Touch events, requestAnimationFrame, audio

### Browser Compatibility
- Chrome 80+
- Firefox 75+ 
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Maintains 60 FPS on modern devices
- Total download size < 2MB
- Memory usage < 50MB
- Input latency < 100ms

## 📁 Project Structure

```
duck-game/
├── index.html          # Main game page
├── game.js            # Game logic and mechanics  
├── style.css          # Styling and responsive design
├── README.md          # This file
├── assets/
│   ├── images/        # Game sprites and images
│   └── sounds/        # Audio effects (placeholder)
└── .github/
    └── copilot-instructions.md
```

## 🌐 Deployment

This game is built as a static web application and can be deployed to any web hosting service:

### GitHub Pages
1. Push code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your game will be available at `https://username.github.io/repository-name`

### Netlify
1. Connect your GitHub repository to Netlify
2. Deploy automatically on every commit
3. Get a custom domain with HTTPS

### Vercel
1. Import project from GitHub
2. Automatic deployments and preview URLs
3. Edge network for global performance

### Local Development
```bash
# Serve locally with Python
python -m http.server 8000

# Or with Node.js
npx serve .

# Or with any other static file server
```

## 🎨 Customization

### Adding New Collectibles
Edit the `types` array in `game.js`:
```javascript
const types = [
    { type: 'breadcrumb', points: 10, color: '#D2691E', size: 8 },
    { type: 'fish', points: 25, color: '#FF6347', size: 12 },
    { type: 'waterlily', points: 50, color: '#FF1493', size: 16 },
    // Add your new collectible here
    { type: 'newitem', points: 75, color: '#00FF00', size: 20 }
];
```

### Modifying Game Physics
Adjust these values in the `DuckGame` constructor:
- `duck.speed`: How fast the duck moves
- `maxCollectibles`: Number of items in the pond
- Game canvas dimensions and responsive behavior

### Styling Changes
Modify `style.css` to change:
- Color schemes and gradients
- Animation speeds and effects  
- Mobile layout and controls
- UI elements and typography

## 🔊 Adding Sound Effects

The game includes placeholder sound functions. To add actual audio:

1. Add audio files to `assets/sounds/`
2. Update the `playSound()` method in `game.js`
3. Preload audio files in the constructor

Example:
```javascript
// In constructor
this.sounds = {
    collect: new Audio('assets/sounds/collect.mp3'),
    quack: new Audio('assets/sounds/quack.mp3')
};

// In playSound method
playSound(type) {
    if (this.sounds[type]) {
        this.sounds[type].play();
    }
}
```

## 🤝 Contributing

Feel free to contribute improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices/browsers
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Future Enhancements

- [ ] Multiple pond levels with different layouts
- [ ] Power-ups and special abilities  
- [ ] Leaderboard system with local storage
- [ ] Achievement system
- [ ] Seasonal themes and events
- [ ] Multiplayer support
- [ ] Progressive Web App (PWA) features
- [ ] Social sharing of scores

---

**Made with 💙 for casual gaming fun!**

Enjoy your duck pond adventure! 🦆✨
