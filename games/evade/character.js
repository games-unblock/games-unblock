let shieldTime = 3; // Shield time in seconds
let shieldActive = true; // Flag to track shield state

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: 'purple'
};

// Event listeners for mouse movement
window.addEventListener('mousemove', event => {
    if (!gameOver) {  // Allow movement if the game is not over
        player.x = event.clientX;
        player.y = event.clientY;
    }
});

function updateShield() {
    if (shieldActive) {
        shieldTime -= 1 / 60;
        if (shieldTime <= 0) {
            shieldActive = false; // Deactivate shield after 3 seconds
        }
    }
}

function drawShield(ctx) {
    if (shieldActive) {
        ctx.font = '18px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText(`Shield: ${Math.ceil(shieldTime)}s`, canvas.width - 150, 60);
    }
}

function resetShield() {
    shieldTime = 3;
    shieldActive = true;
}
