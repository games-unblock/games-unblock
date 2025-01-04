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

function startGame(speed, count) {
    document.querySelector('.menu').style.display = 'none';
    canvas.style.display = 'block';
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

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

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

        // Check for collision with player
        const distX = ball.x - player.x;
        const distY = ball.y - player.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < ball.radius + player.radius) {
            alert('Game Over! You touched a red ball.');
            window.location.reload();
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall({ ...player, color: player.color });
    redBalls.forEach(ball => drawBall({ ...ball, color: 'red' }));

    updateRedBalls();
    requestAnimationFrame(draw);
}

window.addEventListener('mousemove', event => {
    player.x = event.clientX;
    player.y = event.clientY;
});

document.getElementById('easy').addEventListener('click', () => startGame(1.5, 7));
document.getElementById('medium').addEventListener('click', () => startGame(2.5, 10));
document.getElementById('hard').addEventListener('click', () => startGame(2.5, 20));
document.getElementById('impossible').addEventListener('click', () => startGame(3, 50));
