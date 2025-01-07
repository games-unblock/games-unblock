let angle = 0;
let ballX = 50;  // Start with offset from center
let ballY = 0;
let ballSpeedX = 5;
let ballSpeedY = 5;
let circleRadius = 150;
let ballSize = 20;
let dampening = 0.98;  // Slight energy loss on collision

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    strokeWeight(2); // Set stroke weight for better visibility
}

function draw() {
    background(0); // Black background
    
    // Move to center of canvas
    translate(width/2, height/2);
    
    // Save current rotation
    push();
    rotate(angle);
    
    // Draw C-shaped circle (arc from 30 to 330 degrees)
    noFill();
    stroke(255); // White circle
    arc(0, 0, 300, 300, 30, 330);
    pop();
    
    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Simple circle collision
    let distanceFromCenter = sqrt(ballX * ballX + ballY * ballY);
    if (distanceFromCenter > circleRadius - ballSize/2) {
        // Normalize the position vector
        let nx = ballX / distanceFromCenter;
        let ny = ballY / distanceFromCenter;
        
        // Reflect velocity
        let dotProduct = (ballSpeedX * nx + ballSpeedY * ny);
        ballSpeedX = (ballSpeedX - 2 * dotProduct * nx) * dampening;
        ballSpeedY = (ballSpeedY - 2 * dotProduct * ny) * dampening;
        
        // Reset position to circle boundary
        ballX = nx * (circleRadius - ballSize/2);
        ballY = ny * (circleRadius - ballSize/2);
    }
    
    // Draw ball
    fill(255); // White ball
    noStroke();
    circle(ballX, ballY, ballSize);
    
    // Increase rotation angle
    angle += 2;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}