let game = 200;

function setup() {
    // Make canvas size responsive but maintain square aspect ratio
    let size = min(windowWidth * 0.9, windowHeight * 0.7, 600);
    createCanvas(size, size);
}

function windowResized() {
    let size = min(windowWidth * 0.9, windowHeight * 0.7, 600);
    resizeCanvas(size, size);
}

function draw() {
    background("orange");
    noStroke();
    fill("blue");
    rect(0, 0, game, height);
    if (game >= 400){
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
        game += 10;
    }
    if (key == "m") {
        game -= 10;
    }
    if (key == "r") {
        game = 200;
        loop();
    }
}

function resetGame() {
    game = 200;
    loop();
}

function mousePressed() {
    // Adjust to use relative position for better mobile support
    if (mouseX < width/2) {
        game += 10;
    }
    if (mouseX > width/2) {
        game -= 10;
    }
    return false; // Prevents default behavior
}

function touchStarted() {
    // Use same logic as mousePressed
    mousePressed();
    return false; // Prevents default behavior
}

