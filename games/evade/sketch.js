const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let redBalls = [];
let redBallSpeed;
let redBallCount;
let gameOver = false;
let timeElapsed = 0; // Timer variable

// Function to save the top 3 runs in localStorage per difficulty
function saveTopRun(time, difficulty) {
    let topRuns = JSON.parse(localStorage.getItem(`${difficulty}TopRuns`)) || [];
    topRuns.push(time);
    topRuns.sort((a, b) => b - a); // Sort in descending order
    topRuns = topRuns.slice(0, 3); // Keep only top 3
    localStorage.setItem(`${difficulty}TopRuns`, JSON.stringify(topRuns));
    updateTopRunsList(difficulty);
}

// Update the list of top 3 runs in the main menu per difficulty
function updateTopRunsList(difficulty) {
    const topRunsList = document.getElementById(`${difficulty}RunsList`);
    if (!topRunsList) return; // Guard clause in case element doesn't exist

    const topRuns = JSON.parse(localStorage.getItem(`${difficulty}TopRuns`)) || [];
    topRunsList.innerHTML = ''; // Clear the current list

    // Add placeholder entries if less than 3 scores
    const displayRuns = [...topRuns];
    while (displayRuns.length < 3) {
        displayRuns.push(0);
    }

    displayRuns.forEach((time, index) => {
        const li = document.createElement('li');
        li.textContent = time > 0 ? `#${index + 1} - ${Math.floor(time)}s` : `#${index + 1} - None`;
        topRunsList.appendChild(li);
    });
}

// Start the game with the given speed and red ball count
function startGame(speed, count, difficulty) {
    console.log('Game starting with difficulty:', difficulty, 'speed:', speed, 'and count:', count); // Debug log
    document.querySelector('.menu').style.display = 'none';
    canvas.style.display = 'block';
    gameOver = false;  // Reset game over status
    timeElapsed = 0;   // Reset the timer
    resetShield();  // Call the new reset function from character.js
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
    localStorage.setItem('currentDifficulty', difficulty);  // Store current difficulty
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
        if (!shieldActive) {  // Using shieldActive from character.js
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

    // Use the new shield drawing function
    drawShield(ctx);

    timeElapsed += 1 / 60;
    updateShield();  // Use the new shield update function
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

    // Get current difficulty from storage and save the run
    const currentDifficulty = localStorage.getItem('currentDifficulty');
    saveTopRun(timeElapsed, currentDifficulty);
}

// Restart the game
function restartGame() {
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('game-over-screen').style.display = 'none';
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    redBalls = [];
    const currentDifficulty = localStorage.getItem('currentDifficulty') || 'easy';  // Default to 'easy' if no value
    startGame(2.5, 10, currentDifficulty); // Restart the game with selected difficulty
}

// Event listeners for mouse movement
window.addEventListener('mousemove', event => {
    if (!gameOver) {  // Allow movement if the game is not over
        player.x = event.clientX;
        player.y = event.clientY;
    }
});

// Event listener for restarting the game with spacebar
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        restartGame();
    }
});
