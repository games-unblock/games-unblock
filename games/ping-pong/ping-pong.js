let paddleLeftX, paddleLeftY;
let paddleRightX, paddleRightY;
let paddleSpeed;
let paddleHeight, paddleWidth;

let leftScore = 0;
let rightScore = 0;

let ballPosX, ballPosY;
let ballSpeedX, ballSpeedY;
let ballSize;

function setup() {
  // Resize the canvas dynamically
  createCanvas(1100, 700);  // Change this to your desired canvas size

  // Set paddle dimensions and speed relative to canvas size
  paddleWidth = width * 0.025;  // Paddle width as a percentage of canvas width
  paddleHeight = height * 0.2;  // Paddle height as a percentage of canvas height
  paddleSpeed = height * 0.005;  // Paddle speed as a percentage of canvas height

  // Ball size as a percentage of canvas size
  ballSize = width * 0.025;

  // Initial positions of paddles and ball
  paddleLeftX = width * 0.05;  // Left paddle positioned a bit from the left
  paddleLeftY = height / 2;

  paddleRightX = width * 0.95; // Right paddle positioned a bit from the right
  paddleRightY = height / 2;

  ballPosX = width / 2;
  ballPosY = height / 2;
  ballSpeedX = random([-20, 20]);
  ballSpeedY = random([-12, 12]);

  // Draw rectangles from their center
  rectMode(CENTER);
  fill(255);
  noStroke();
  textSize(width * 0.1);  // Scale text size to the canvas size
  textAlign(CENTER);

  // Start paused
  noLoop();
}

function draw() {
  background(0);

  // Draw the paddles
  rect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
  rect(paddleRightX, paddleRightY, paddleWidth, paddleHeight);

  // Draw the ball
  square(ballPosX, ballPosY, ballSize);

  // Draw the score
  text(leftScore, width * 0.25, height * 0.1);
  text(rightScore, width * 0.75, height * 0.1);

  // Move the ball using its current speed
  ballPosX += ballSpeedX;
  ballPosY += ballSpeedY;

  // Left paddle collision
  let leftCollisionLeft = paddleLeftX - paddleWidth / 2 - ballSize / 2;
  let leftCollisionRight = paddleLeftX + paddleWidth / 2 + ballSize / 2;
  let leftCollisionTop = paddleLeftY - paddleHeight / 2 - ballSize / 2;
  let leftCollisionBottom = paddleLeftY + paddleHeight / 2 + ballSize / 2;

  if (
    ballPosX >= leftCollisionLeft &&
    ballPosX <= leftCollisionRight &&
    ballPosY >= leftCollisionTop &&
    ballPosY <= leftCollisionBottom
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (ballPosY - paddleLeftY) / 20;
  }

  // Right paddle collision
  let rightCollisionLeft = paddleRightX - paddleWidth / 2 - ballSize / 2;
  let rightCollisionRight = paddleRightX + paddleWidth / 2 + ballSize / 2;
  let rightCollisionTop = paddleRightY - paddleHeight / 2 - ballSize / 2;
  let rightCollisionBottom = paddleRightY + paddleHeight / 2 + ballSize / 2;

  if (
    ballPosX >= rightCollisionLeft &&
    ballPosX <= rightCollisionRight &&
    ballPosY >= rightCollisionTop &&
    ballPosY <= rightCollisionBottom
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (ballPosY - paddleRightY) / 20;
  }

  // Scoring
  if (ballPosX < 0) {
    rightScore += 1;
    resetBall();
  } else if (ballPosX > width) {
    leftScore += 1;
    resetBall();
  } else if (ballPosY < 0 || ballPosY > height) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle movement
  let leftMove = 0;
  if (keyIsDown(83)) leftMove += paddleSpeed;  // S key (down)
  if (keyIsDown(87)) leftMove -= paddleSpeed;  // W key (up)
  paddleLeftY = constrain(paddleLeftY + leftMove, paddleHeight / 2, height - paddleHeight / 2);

  // Right paddle movement
  let rightMove = 0;
  if (keyIsDown(DOWN_ARROW)) rightMove += paddleSpeed;  // Down arrow
  if (keyIsDown(UP_ARROW)) rightMove -= paddleSpeed;  // Up arrow
  paddleRightY = constrain(paddleRightY + rightMove, paddleHeight / 2, height - paddleHeight / 2);

  // Show 'Click to start' if game is paused
  if (isLooping() === false) {
    text('Click to start', width / 2, height / 2 - 20);
  }
}

function resetBall() {
  ballPosX = width / 2;
  ballPosY = height / 2;
  ballSpeedX = random([-3, 3]);
  ballSpeedY = random([-1, 1]);
}

function mousePressed() {
  if (isLooping() === false) {
    resetBall();
    loop();
  }
}
