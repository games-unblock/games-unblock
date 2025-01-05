let game = 200;
let touchStartX = 0;
let lastTapTime = 0;
let lastTapX = 0;

function setup() {
    // Make canvas responsive
    let canvasSize = min(windowWidth - 20, 400);
    createCanvas(canvasSize, canvasSize);
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

function touchStarted() {
    touchStartX = mouseX;
    
    // Left side tap
    if (mouseX < width/2) {
        game += 10;
    }
    // Right side tap
    if (mouseX > width/2) {
        game -= 10;
    }
    
    // Tap both sides quickly to restart (within 300ms)
    if (millis() - lastTapTime < 300 && abs(touchStartX - lastTapX) > width/2) {
        game = 200;
        loop();
    }
    
    lastTapTime = millis();
    lastTapX = touchStartX;
    
    return false; // Prevent default
}

function windowResized() {
    let canvasSize = min(windowWidth - 20, 400);
    resizeCanvas(canvasSize, canvasSize);
}

