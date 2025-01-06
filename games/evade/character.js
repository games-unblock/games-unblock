let shieldTime = 3; // Shield time in seconds
let shieldActive = true; // Flag to track shield state

// Add velocity properties to player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: 'purple',
    velocityX: 0,
    velocityY: 0
};

// Adjust momentum constants for slower movement
const ACCELERATION = 0.2;  // Reduced from 0.8
const FRICTION = 0.99;     // Increased from 0.98 for smoother deceleration
const MAX_SPEED = 4;       // Reduced from 12

// Analog stick properties
const analogStick = {
    x: 0,
    y: 0,
    baseX: 0,
    baseY: 0,
    radius: 50,
    active: false,
    offsetX: 0,
    offsetY: 0
};

// Track mouse position
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Add arrow key state tracking
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Remove or comment out the mousemove event listener since we want pure analog control
// window.addEventListener('mousemove', event => { ... });

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

function initAnalogStick() {
    const isMobile = localStorage.getItem('selectedDevice') === 'phone';
    if (isMobile) {
        // Position analog stick more comfortably for mobile
        analogStick.baseX = analogStick.radius * 1.5;
        analogStick.baseY = canvas.height - analogStick.radius * 1.5;
    } else {
        // Original position for desktop
        analogStick.baseX = canvas.width - analogStick.radius * 2;
        analogStick.baseY = canvas.height - analogStick.radius * 2;
    }
    analogStick.x = analogStick.baseX;
    analogStick.y = analogStick.baseY;
}

function drawAnalogStick(ctx) {
    ctx.globalAlpha = 0.5;
    // Draw base circle
    ctx.beginPath();
    ctx.arc(analogStick.baseX, analogStick.baseY, analogStick.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#666666';
    ctx.fill();
    
    // Draw stick
    ctx.beginPath();
    ctx.arc(analogStick.x, analogStick.y, analogStick.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#444444';
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

// Update analog stick from keyboard
function updateAnalogFromKeys() {
    if (!analogStick.active) {  // Only use keys if touch isn't active
        let dx = 0;
        let dy = 0;
        
        if (keys.left) dx -= 1;
        if (keys.right) dx += 1;
        if (keys.up) dy -= 1;
        if (keys.down) dy += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 || dy !== 0) {
            // Only normalize if there's movement
            if (dx !== 0 && dy !== 0) {
                const length = Math.sqrt(dx * dx + dy * dy);
                dx /= length;
                dy /= length;
            }
            
            // Update analog stick position and offset
            analogStick.x = analogStick.baseX + dx * analogStick.radius;
            analogStick.y = analogStick.baseY + dy * analogStick.radius;
            analogStick.offsetX = dx;
            analogStick.offsetY = dy;
        }
    }
}

// Add keyboard event listeners
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': keys.up = true; break;
        case 'ArrowDown': keys.down = true; break;
        case 'ArrowLeft': keys.left = true; break;
        case 'ArrowRight': keys.right = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowUp': keys.up = false; break;
        case 'ArrowDown': keys.down = false; break;
        case 'ArrowLeft': keys.left = false; break;
        case 'ArrowRight': keys.right = false; break;
    }
    
    // Reset analog stick if no keys are pressed
    if (!keys.up && !keys.down && !keys.left && !keys.right && !analogStick.active) {
        analogStick.x = analogStick.baseX;
        analogStick.y = analogStick.baseY;
        analogStick.offsetX = 0;
        analogStick.offsetY = 0;
    }
});

function updatePlayerPosition() {
    if (!gameOver) {
        // Update analog stick from keyboard
        updateAnalogFromKeys();
        
        // Handle analog stick influence with momentum
        if (analogStick.offsetX !== 0 || analogStick.offsetY !== 0 || keys.up || keys.down || keys.left || keys.right) {
            // Apply acceleration in analog direction
            player.velocityX += analogStick.offsetX * ACCELERATION;
            player.velocityY += analogStick.offsetY * ACCELERATION;
        } else {
            // Apply stronger friction when no input
            player.velocityX *= 0.98;  // Increased from 0.95 for smoother stopping
            player.velocityY *= 0.98;
        }
        
        // Limit maximum speed
        const speed = Math.sqrt(player.velocityX * player.velocityX + player.velocityY * player.velocityY);
        if (speed > MAX_SPEED) {
            const angle = Math.atan2(player.velocityY, player.velocityX);
            player.velocityX = Math.cos(angle) * MAX_SPEED;
            player.velocityY = Math.sin(angle) * MAX_SPEED;
        }
        
        // Apply base friction
        player.velocityX *= FRICTION;
        player.velocityY *= FRICTION;
        
        // Update position
        player.x += player.velocityX;
        player.y += player.velocityY;
        
        // Wrap around screen edges instead of bouncing
        if (player.x < -player.radius) {
            player.x = canvas.width + player.radius;
        }
        if (player.x > canvas.width + player.radius) {
            player.x = -player.radius;
        }
        if (player.y < -player.radius) {
            player.y = canvas.height + player.radius;
        }
        if (player.y > canvas.height + player.radius) {
            player.y = -player.radius;
        }
    }
}

window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Check if touch is in analog stick area
    const dx = touchX - analogStick.baseX;
    const dy = touchY - analogStick.baseY;
    if (Math.sqrt(dx * dx + dy * dy) < analogStick.radius) {
        analogStick.active = true;
    }
});

window.addEventListener('touchmove', (e) => {
    if (analogStick.active) {
        const touch = e.touches[0];
        const dx = touch.clientX - analogStick.baseX;
        const dy = touch.clientY - analogStick.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < analogStick.radius) {
            analogStick.x = touch.clientX;
            analogStick.y = touch.clientY;
        } else {
            const angle = Math.atan2(dy, dx);
            analogStick.x = analogStick.baseX + Math.cos(angle) * analogStick.radius;
            analogStick.y = analogStick.baseY + Math.sin(angle) * analogStick.radius;
        }
        
        analogStick.offsetX = (analogStick.x - analogStick.baseX) / analogStick.radius;
        analogStick.offsetY = (analogStick.y - analogStick.baseY) / analogStick.radius;
        e.preventDefault();
    }
});

window.addEventListener('touchend', () => {
    analogStick.active = false;
    analogStick.x = analogStick.baseX;
    analogStick.y = analogStick.baseY;
    analogStick.offsetX = 0;
    analogStick.offsetY = 0;
});

// Initialize analog stick position
initAnalogStick();
