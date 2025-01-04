const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    color: 'purple'
};

let redBalls = [];
let redBallSpeed;
let redBallCount;
let gameOver = false;
let timeElapsed = 0; // Timer variable
let shieldTime = 3; // Shield time in seconds
let shieldActive = true; // Flag to track shield state

// Function to save the top 3 runs in localStorage
function saveTopRun(time) {
    let topRuns = JSON.parse(localStorage.getItem('topRuns')) || [];
    topRuns.push(time);
    topRuns.sort((a, b) => b - a); // Sort in descending order
    topRuns = topRuns.slice(0, 3); // Keep only top 3
    localStorage.setItem('topRuns', JSON.stringify(topRuns));
    updateTopRunsList();
}

// Update the list of top 3 runs in the main menu
function updateTopRunsList() {
    const topRunsList = document.getElementById('topRunsList');
    const topRuns = JSON.parse(localStorage.getItem('topRuns')) || [];
    topRunsList.innerHTML = ''; // Clear the current list
    topRuns.forEach((time, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1} - ${Math.floor(time)}s`;
        topRunsList.appendChild(li);
    });
}

// Start the game with the given speed and red ball count
function startGame(speed, count) {
    document.querySelector('.menu').style.display = 'none';
    canvas.style.display = 'block';
    gameOver = false;  // Reset game over status
    timeElapsed = 0;   // Reset the timer
    shieldActive = true;  // Activate the shield
    redBallSpeed = speed;
    redBallCount = count;
    redBalls = [];
    for (let i = 0; i < redBallCount; i++) {
        redBalls.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 10,
            dx: (Math.random() - 0.5) * redBallSpeed,
            dy: (Math.random() - 0.5) * redBallSpeed
        });
    }
    draw();
}

// Draw a ball on the canvas
function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Update red balls' positions and check for collisions
function updateRedBalls() {
    redBalls.forEach(ball => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off walls
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx *= -1;
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

        // If shield is active, skip collision check
        if (!shieldActive) {
            // Check for collision with player
            const distX = ball.x - player.x;
            const distY = ball.y - player.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < ball.radius + player.radius) {
                endGame();  // Trigger the game over screen
            }
        }
    });
}

// Main drawing function
function draw() {
    if (gameOver) return; // Stop drawing if game is over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player and red balls
    drawBall({ ...player, color: player.color });
    redBalls.forEach(ball => drawBall({ ...ball, color: 'red' }));

    // Draw the timer in the top right corner
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${Math.floor(timeElapsed)}s`, canvas.width - 150, 30);

    // Draw shield countdown (optional visual indicator)
    if (shieldActive) {
        ctx.font = '18px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText(`Shield: ${Math.ceil(shieldTime)}s`, canvas.width - 150, 60);
    }

    // Increment the timer and decrease shield time
    timeElapsed += 1 / 60;
    if (shieldActive) {
        shieldTime -= 1 / 60;
        if (shieldTime <= 0) {
            shieldActive = false; // Deactivate shield after 3 seconds
        }
    }

    updateRedBalls();
    requestAnimationFrame(draw); // Call draw function repeatedly
}

// End the game, show the game over screen
function endGame() {
    gameOver = true;
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'flex';

    // Display the time on the game over screen
    const timeDisplay = document.getElementById('game-time');
    timeDisplay.textContent = `You lasted: ${Math.floor(timeElapsed)} seconds`;
    timeDisplay.style.color = 'red';

    // Save the top runs
    saveTopRun(timeElapsed);
}

// Restart the game
function restartGame() {
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('game-over-screen').style.display = 'none';
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    redBalls = [];
    startGame(2.5, 10); // Restart the game with default difficulty
}

// Event listeners for mouse movement
window.addEventListener('mousemove', event => {
    if (!gameOver) {  // Allow movement if the game is not over
        player.x = event.clientX;
        player.y = event.clientY;
    }
});

// Event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', () => startGame(1.5, 7));
document.getElementById('medium').addEventListener('click', () => startGame(2.5, 10));
document.getElementById('hard').addEventListener('click', () => startGame(3, 15));
document.getElementById('impossible').addEventListener('click', () => startGame(4, 60));

// Event listener for restarting the game with spacebar
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        restartGame();
    }
});

// Back to the main menu
document.querySelector('.overlay a').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'index.html';  // Navigate back to main menu
});

// Initialize the top runs list
updateTopRunsList();
