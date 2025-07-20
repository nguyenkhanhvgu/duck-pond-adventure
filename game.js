// Duck Pond Adventure - Game Logic
class DuckGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('gameOverlay');
        
        // Game state
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'
        this.score = 0;
        this.itemsCollected = 0;
        this.gameTime = 0;
        this.gameStartTime = 0;
        
        // Game objects
        this.duck = {
            x: 400,
            y: 300,
            width: 40,
            height: 40,
            speed: 3,
            color: '#FFD700',
            direction: 0 // for animation
        };
        
        this.collectibles = [];
        this.maxCollectibles = 12;
        
        // Input handling
        this.keys = {};
        this.mobile = {
            touching: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0
        };
        
        // Animation
        this.animationId = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupCanvas();
        this.generateCollectibles();
        this.gameLoop();
    }
    
    setupCanvas() {
        // Make canvas responsive
        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Set canvas size based on container but maintain aspect ratio
        const aspectRatio = 4/3; // 800x600
        let canvasWidth = Math.min(800, containerRect.width - 40);
        let canvasHeight = canvasWidth / aspectRatio;
        
        if (canvasHeight > containerRect.height - 40) {
            canvasHeight = containerRect.height - 40;
            canvasWidth = canvasHeight * aspectRatio;
        }
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';
        
        // Update duck position to be centered
        this.duck.x = canvasWidth / 2;
        this.duck.y = canvasHeight / 2;
    }
    
    setupEventListeners() {
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space' && this.gameState === 'playing') {
                this.pauseGame();
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mobile touch events
        this.setupMobileControls();
        
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }
    
    setupMobileControls() {
        const joystick = document.getElementById('mobileJoystick');
        const joystickInner = document.getElementById('joystickInner');
        
        // Touch events for joystick
        joystick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mobile.touching = true;
            const rect = joystick.getBoundingClientRect();
            this.mobile.startX = rect.left + rect.width / 2;
            this.mobile.startY = rect.top + rect.height / 2;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.mobile.touching) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            this.mobile.currentX = touch.clientX;
            this.mobile.currentY = touch.clientY;
            
            // Update joystick visual
            const deltaX = this.mobile.currentX - this.mobile.startX;
            const deltaY = this.mobile.currentY - this.mobile.startY;
            const distance = Math.min(30, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
            const angle = Math.atan2(deltaY, deltaX);
            
            const joyX = Math.cos(angle) * distance;
            const joyY = Math.sin(angle) * distance;
            
            joystickInner.style.transform = `translate(calc(-50% + ${joyX}px), calc(-50% + ${joyY}px))`;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!this.mobile.touching) return;
            e.preventDefault();
            this.mobile.touching = false;
            joystickInner.style.transform = 'translate(-50%, -50%)';
        });
        
        // Canvas touch events for direct touch control
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState !== 'playing') return;
            
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
            
            // Move duck towards touch point
            this.duck.targetX = x;
            this.duck.targetY = y;
        });
    }
    
    generateCollectibles() {
        this.collectibles = [];
        const types = [
            { type: 'breadcrumb', points: 10, color: '#D2691E', size: 8 },
            { type: 'fish', points: 25, color: '#FF6347', size: 12 },
            { type: 'waterlily', points: 50, color: '#FF1493', size: 16 }
        ];
        
        for (let i = 0; i < this.maxCollectibles; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const collectible = {
                ...type,
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: Math.random() * (this.canvas.height - 40) + 20,
                collected: false,
                bobOffset: Math.random() * Math.PI * 2
            };
            
            // Ensure collectibles don't spawn too close to duck
            const duckDistance = Math.sqrt(
                Math.pow(collectible.x - this.duck.x, 2) + 
                Math.pow(collectible.y - this.duck.y, 2)
            );
            if (duckDistance < 80) {
                i--; // Try again
                continue;
            }
            
            this.collectibles.push(collectible);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameStartTime = Date.now();
        this.hideOverlay();
        document.getElementById('pauseBtn').style.display = 'inline-block';
        this.playSound('start');
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showOverlay('Game Paused', 'Press Start to continue');
            document.getElementById('startBtn').textContent = 'Resume';
            document.getElementById('startBtn').style.display = 'inline-block';
        }
    }
    
    restartGame() {
        this.gameState = 'menu';
        this.score = 0;
        this.itemsCollected = 0;
        this.gameTime = 0;
        this.duck.x = this.canvas.width / 2;
        this.duck.y = this.canvas.height / 2;
        this.generateCollectibles();
        this.updateUI();
        this.showOverlay('Duck Pond Adventure!', 'Collect breadcrumbs (10pts), fish (25pts), and water lilies (50pts)');
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'none';
    }
    
    showOverlay(title, message) {
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        this.overlay.style.display = 'flex';
        this.overlay.classList.add('fade-in');
    }
    
    hideOverlay() {
        this.overlay.classList.add('fade-out');
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.classList.remove('fade-in', 'fade-out');
        }, 300);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update game time
        this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        
        // Update duck position
        this.updateDuckMovement();
        
        // Check collisions
        this.checkCollisions();
        
        // Check win condition
        if (this.collectibles.every(item => item.collected)) {
            this.gameState = 'gameOver';
            this.showGameOver();
        }
        
        this.updateUI();
    }
    
    updateDuckMovement() {
        let moveX = 0;
        let moveY = 0;
        
        // Keyboard input
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) moveX -= 1;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) moveX += 1;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) moveY -= 1;
        if (this.keys['ArrowDown'] || this.keys['KeyS']) moveY += 1;
        
        // Mobile joystick input
        if (this.mobile.touching) {
            const deltaX = this.mobile.currentX - this.mobile.startX;
            const deltaY = this.mobile.currentY - this.mobile.startY;
            const deadzone = 10;
            
            if (Math.abs(deltaX) > deadzone) moveX += deltaX / 30;
            if (Math.abs(deltaY) > deadzone) moveY += deltaY / 30;
        }
        
        // Touch target movement
        if (this.duck.targetX !== undefined) {
            const deltaX = this.duck.targetX - this.duck.x;
            const deltaY = this.duck.targetY - this.duck.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > 5) {
                moveX += (deltaX / distance) * 0.8;
                moveY += (deltaY / distance) * 0.8;
            } else {
                this.duck.targetX = undefined;
                this.duck.targetY = undefined;
            }
        }
        
        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }
        
        // Apply movement with boundaries
        this.duck.x += moveX * this.duck.speed;
        this.duck.y += moveY * this.duck.speed;
        
        // Keep duck within canvas bounds
        this.duck.x = Math.max(this.duck.width/2, Math.min(this.canvas.width - this.duck.width/2, this.duck.x));
        this.duck.y = Math.max(this.duck.height/2, Math.min(this.canvas.height - this.duck.height/2, this.duck.y));
        
        // Update direction for animation
        if (moveX !== 0 || moveY !== 0) {
            this.duck.direction += 0.2;
            this.playSound('move');
        }
    }
    
    checkCollisions() {
        this.collectibles.forEach(item => {
            if (item.collected) return;
            
            const distance = Math.sqrt(
                Math.pow(this.duck.x - item.x, 2) + 
                Math.pow(this.duck.y - item.y, 2)
            );
            
            if (distance < (this.duck.width/2 + item.size)) {
                item.collected = true;
                this.score += item.points;
                this.itemsCollected++;
                this.showScorePopup(item.x, item.y, item.points);
                this.playSound('collect');
                
                // Respawn item after a delay
                setTimeout(() => {
                    item.collected = false;
                    item.x = Math.random() * (this.canvas.width - 40) + 20;
                    item.y = Math.random() * (this.canvas.height - 40) + 20;
                }, 3000 + Math.random() * 2000);
            }
        });
    }
    
    showScorePopup(x, y, points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        
        this.canvas.parentElement.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    showGameOver() {
        const timeBonus = Math.max(0, 300 - this.gameTime) * 2;
        const finalScore = this.score + timeBonus;
        
        this.showOverlay(
            'Congratulations!', 
            `You collected all items! Final Score: ${finalScore} (Time Bonus: ${timeBonus})`
        );
        
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'inline-block';
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pond background
        this.drawPondBackground();
        
        // Draw collectibles
        this.drawCollectibles();
        
        // Draw duck
        this.drawDuck();
        
        // Draw water effects
        this.drawWaterEffects();
    }
    
    drawPondBackground() {
        // Water gradient
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, 0,
            this.canvas.width/2, this.canvas.height/2, Math.max(this.canvas.width, this.canvas.height)/2
        );
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw lily pads and reeds as decorations
        this.drawDecorations();
    }
    
    drawDecorations() {
        // Lily pads
        this.ctx.fillStyle = '#228B22';
        for (let i = 0; i < 5; i++) {
            const x = (i + 1) * (this.canvas.width / 6);
            const y = 30 + Math.sin(Date.now() * 0.001 + i) * 10;
            
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, 25, 15, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Reeds
        this.ctx.strokeStyle = '#556B2F';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const x = 20 + (i * (this.canvas.width - 40) / 7);
            const height = 40 + Math.sin(Date.now() * 0.002 + i) * 10;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.canvas.height);
            this.ctx.lineTo(x + Math.sin(Date.now() * 0.003 + i) * 5, this.canvas.height - height);
            this.ctx.stroke();
        }
    }
    
    drawCollectibles() {
        this.collectibles.forEach(item => {
            if (item.collected) return;
            
            const bobOffset = Math.sin(Date.now() * 0.005 + item.bobOffset) * 3;
            const x = item.x;
            const y = item.y + bobOffset;
            
            this.ctx.fillStyle = item.color;
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 1;
            
            if (item.type === 'breadcrumb') {
                this.ctx.beginPath();
                this.ctx.arc(x, y, item.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (item.type === 'fish') {
                // Draw simple fish shape
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, item.size, item.size * 0.6, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Fish tail
                this.ctx.beginPath();
                this.ctx.moveTo(x + item.size, y);
                this.ctx.lineTo(x + item.size + 8, y - 4);
                this.ctx.lineTo(x + item.size + 8, y + 4);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            } else if (item.type === 'waterlily') {
                // Draw flower petals
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const petalX = x + Math.cos(angle) * item.size * 0.5;
                    const petalY = y + Math.sin(angle) * item.size * 0.5;
                    
                    this.ctx.beginPath();
                    this.ctx.ellipse(petalX, petalY, item.size * 0.4, item.size * 0.2, angle, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Center
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(x, y, item.size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawDuck() {
        const x = this.duck.x;
        const y = this.duck.y;
        
        // Duck body
        this.ctx.fillStyle = this.duck.color;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, this.duck.width/2, this.duck.height/2 * 0.8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Duck head
        this.ctx.beginPath();
        this.ctx.arc(x - 8, y - 10, 12, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Duck bill
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.ellipse(x - 18, y - 8, 6, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Duck eye
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(x - 5, y - 12, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Wing
        this.ctx.fillStyle = '#DAA520';
        this.ctx.beginPath();
        this.ctx.ellipse(x + 5, y - 2, 8, 6, Math.sin(this.duck.direction) * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    drawWaterEffects() {
        // Simple ripple effects around the duck
        const time = Date.now() * 0.01;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            const radius = 30 + i * 15 + Math.sin(time + i) * 5;
            this.ctx.beginPath();
            this.ctx.arc(this.duck.x, this.duck.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('itemsCollected').textContent = this.itemsCollected;
        
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        document.getElementById('gameTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    playSound(type) {
        // Placeholder for sound effects
        // In a full implementation, you would load and play actual audio files
        if (type === 'collect') {
            // Play collect sound
        } else if (type === 'move') {
            // Play movement sound (quack) occasionally
            if (Math.random() < 0.01) {
                // Quack sound
            }
        } else if (type === 'start') {
            // Play start game sound
        }
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update();
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.duckGame = new DuckGame();
});

// Handle visibility change to pause game when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (window.duckGame && document.hidden && window.duckGame.gameState === 'playing') {
        window.duckGame.pauseGame();
    }
});
