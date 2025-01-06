let game;
let moveAmount;

function setup() {
    let size = min(windowWidth * 0.9, windowHeight * 0.7, 600);
    createCanvas(size, size);
    // Set initial position to middle of canvas
    game = width/2;
    // Scale movement amount relative to canvas width
    moveAmount = width/40; // This gives us 20 moves from center to edge
}

function windowResized() {
    let size = min(windowWidth * 0.9, windowHeight * 0.7, 600);
    resizeCanvas(size, size);
    // Rescale game position and movement for new size
    game = game * (width/size);
    moveAmount = width/40;
}

function draw() {
    background("orange");
    noStroke();
    fill("blue");
    rect(0, 0, game, height);
    if (game >= width){  // Changed from 400 to width
        textSize(20);
        fill("black");
        textAlign(CENTER);
        text("Blue Wins!", width/2, height/2);
        noLoop();
    }
    if (game <= 0){
        textSize(20);
        fill("black");
        textAlign(CENTER);
        text("Orange Wins!", width/2, height/2);
        noLoop();
    }
}

function keyPressed(){
    if (key == "z") {
        game += moveAmount;
    }
    if (key == "m") {
        game -= moveAmount;
    }
    if (key == "r") {
        game = width/2;  // Reset to middle
        loop();
    }
}

function resetGame() {
    game = width/2;  // Reset to middle
    loop();
}

function mousePressed() {
    // Adjust to use relative position for better mobile support
    if (mouseX < width/2) {
        game += moveAmount;
    }
    if (mouseX > width/2) {
        game -= moveAmount;
    }
    return false; // Prevents default behavior
}

function touchStarted() {
    // Use same logic as mousePressed
    mousePressed();
    return false; // Prevents default behavior
}

