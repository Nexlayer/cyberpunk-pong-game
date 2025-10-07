class CyberpunkPong {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Scores
        this.playerScore = 0;
        this.aiScore = 0;
        
        // Paddles
        this.paddleWidth = 15;
        this.paddleHeight = 80;
        this.paddleSpeed = 8;
        
        this.playerPaddle = {
            x: 20,
            y: this.height / 2 - this.paddleHeight / 2,
            dy: 0
        };
        
        this.aiPaddle = {
            x: this.width - 20 - this.paddleWidth,
            y: this.height / 2 - this.paddleHeight / 2,
            dy: 0
        };
        
        // Ball
        this.ball = {
            x: this.width / 2,
            y: this.height / 2,
            size: 8,
            dx: 5,
            dy: 3,
            speed: 5
        };
        
        // Effects
        this.particles = [];
        this.trailPoints = [];
        
        // Controls
        this.keys = {};
        this.setupControls();
        
        // UI elements
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.gameStatus = document.getElementById('gameStatus');
        this.playerScoreElement = document.getElementById('player-score');
        this.aiScoreElement = document.getElementById('ai-score');
        
        this.setupEventListeners();
        this.draw();
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            this.toggleGame();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    toggleGame() {
        if (!this.gameRunning) {
            this.startGame();
        } else {
            this.gamePaused = !this.gamePaused;
            this.updateGameStatus();
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.startBtn.textContent = 'PAUSE';
        this.updateGameStatus();
        this.gameLoop();
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.playerScore = 0;
        this.aiScore = 0;
        this.resetBall();
        this.startBtn.textContent = 'START GAME';
        this.updateGameStatus();
        this.updateScores();
        this.draw();
    }
    
    resetBall() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * this.ball.speed;
        this.ball.dy = (Math.random() - 0.5) * this.ball.speed * 2;
        this.trailPoints = [];
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.updatePaddles();
        this.updateBall();
        this.updateAI();
        this.updateParticles();
        this.updateTrail();
    }
    
    updatePaddles() {
        // Player paddle movement
        if (this.keys['w'] && this.playerPaddle.y > 0) {
            this.playerPaddle.dy = -this.paddleSpeed;
        } else if (this.keys['s'] && this.playerPaddle.y < this.height - this.paddleHeight) {
            this.playerPaddle.dy = this.paddleSpeed;
        } else {
            this.playerPaddle.dy = 0;
        }
        
        this.playerPaddle.y += this.playerPaddle.dy;
        
        // AI paddle movement
        const aiCenter = this.aiPaddle.y + this.paddleHeight / 2;
        const ballCenter = this.ball.y;
        
        if (aiCenter < ballCenter - 10) {
            this.aiPaddle.dy = this.paddleSpeed * 0.8;
        } else if (aiCenter > ballCenter + 10) {
            this.aiPaddle.dy = -this.paddleSpeed * 0.8;
        } else {
            this.aiPaddle.dy = 0;
        }
        
        this.aiPaddle.y += this.aiPaddle.dy;
        
        // Keep AI paddle in bounds
        if (this.aiPaddle.y < 0) this.aiPaddle.y = 0;
        if (this.aiPaddle.y > this.height - this.paddleHeight) {
            this.aiPaddle.y = this.height - this.paddleHeight;
        }
    }
    
    updateBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.height - this.ball.size) {
            this.ball.dy = -this.ball.dy;
            this.createParticles(this.ball.x, this.ball.y);
        }
        
        // Ball collision with paddles
        if (this.checkPaddleCollision(this.playerPaddle) || this.checkPaddleCollision(this.aiPaddle)) {
            this.ball.dx = -this.ball.dx;
            this.ball.dy += (Math.random() - 0.5) * 2;
            this.createParticles(this.ball.x, this.ball.y);
            this.createTrailEffect();
        }
        
        // Ball out of bounds
        if (this.ball.x <= 0) {
            this.aiScore++;
            this.updateScores();
            this.resetBall();
            this.createParticles(this.ball.x, this.ball.y);
        } else if (this.ball.x >= this.width) {
            this.playerScore++;
            this.updateScores();
            this.resetBall();
            this.createParticles(this.ball.x, this.ball.y);
        }
    }
    
    checkPaddleCollision(paddle) {
        return this.ball.x < paddle.x + this.paddleWidth &&
               this.ball.x + this.ball.size > paddle.x &&
               this.ball.y < paddle.y + this.paddleHeight &&
               this.ball.y + this.ball.size > paddle.y;
    }
    
    updateAI() {
        // AI difficulty increases with score
        const difficulty = Math.min(1.2, 0.8 + (this.aiScore - this.playerScore) * 0.1);
        this.aiPaddle.dy *= difficulty;
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 4,
                dy: (Math.random() - 0.5) * 4,
                life: 30,
                maxLife: 30,
                color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    createTrailEffect() {
        this.trailPoints.push({
            x: this.ball.x,
            y: this.ball.y,
            life: 20
        });
        
        if (this.trailPoints.length > 10) {
            this.trailPoints.shift();
        }
    }
    
    updateTrail() {
        for (let i = this.trailPoints.length - 1; i >= 0; i--) {
            this.trailPoints[i].life--;
            if (this.trailPoints[i].life <= 0) {
                this.trailPoints.splice(i, 1);
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw center line
        this.drawCenterLine();
        
        // Draw paddles
        this.drawPaddle(this.playerPaddle, '#00ffff');
        this.drawPaddle(this.aiPaddle, '#ff00ff');
        
        // Draw ball
        this.drawBall();
        
        // Draw particles
        this.drawParticles();
        
        // Draw trail
        this.drawTrail();
    }
    
    drawCenterLine() {
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawPaddle(paddle, color) {
        // Glow effect
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 15;
        
        // Gradient fill
        const gradient = this.ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + this.paddleWidth, paddle.y);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(paddle.x, paddle.y, this.paddleWidth, this.paddleHeight);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(paddle.x, paddle.y, this.paddleWidth, this.paddleHeight);
        
        this.ctx.shadowBlur = 0;
    }
    
    drawBall() {
        // Glow effect
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 20;
        
        // Ball
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x + this.ball.size / 2, this.ball.y + this.ball.size / 2, this.ball.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner glow
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x + this.ball.size / 2, this.ball.y + this.ball.size / 2, this.ball.size / 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawTrail() {
        this.trailPoints.forEach((point, index) => {
            const alpha = point.life / 20;
            this.ctx.globalAlpha = alpha * 0.5;
            this.ctx.fillStyle = '#00ffff';
            this.ctx.beginPath();
            this.ctx.arc(point.x + this.ball.size / 2, point.y + this.ball.size / 2, this.ball.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    updateScores() {
        this.playerScoreElement.textContent = this.playerScore;
        this.aiScoreElement.textContent = this.aiScore;
    }
    
    updateGameStatus() {
        if (!this.gameRunning) {
            this.gameStatus.textContent = 'Press START to begin';
        } else if (this.gamePaused) {
            this.gameStatus.textContent = 'GAME PAUSED';
        } else {
            this.gameStatus.textContent = '';
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkPong();
}); 