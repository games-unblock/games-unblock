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
    // Check if click/tap is within canvas bounds AND not in bottom 20% of canvas
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height * 0.8) {
        // If clicked on blue area (left)
        if (mouseX <= game) {
            game += moveAmount;
        }
        // If clicked on orange area (right)
        if (mouseX > game) {
            game -= moveAmount;
        }
        return false;
    }
    return true;
}

function touchStarted() {
    // Use the same logic as mousePressed
    return mousePressed();
}