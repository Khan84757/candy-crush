// Canvas and Game Variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const colorButtons = document.querySelectorAll('.color-btn');

// Game Data
let score = 0;
let level = 1;
let timer = 60;
let activeColor = '';
let bottles = [];

// Initialize Game
function initGame() {
    bottles = Array.from({ length: 4 }, (_, i) => ({
        x: 50 + i * 70,
        y: 300,
        width: 50,
        height: 100,
        color: null,
    }));
    render();
    startTimer();
}

// Draw Bottles
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bottles.forEach((bottle) => {
        ctx.fillStyle = bottle.color || '#ddd';
        ctx.fillRect(bottle.x, bottle.y, bottle.width, bottle.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(bottle.x, bottle.y, bottle.width, bottle.height);
    });
}

// Handle Color Selection
colorButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        activeColor = btn.classList[1];
    });
});

// Fill Bottles
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    bottles.forEach((bottle) => {
        if (
            x > bottle.x &&
            x < bottle.x + bottle.width &&
            y > bottle.y &&
            y < bottle.y + bottle.height
        ) {
            if (!bottle.color && activeColor) {
                bottle.color = activeColor;
                score += 10;
                scoreDisplay.textContent = score;
                checkLevelUp();
            }
        }
    });

    render();
});

// Level Up
function checkLevelUp() {
    if (bottles.every((bottle) => bottle.color)) {
        level++;
        levelDisplay.textContent = level;
        bottles.forEach((bottle) => (bottle.color = null));
        render();
    }
}

// Timer
function startTimer() {
    const interval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(interval);
            alert('Game Over! Your final score: ' + score);
            location.reload();
        }
    }, 1000);
}

// Redirect Every 15 Seconds
setInterval(() => {
    window.open('https://example.com', '_blank');
}, 15000);

// Start Game
initGame();
