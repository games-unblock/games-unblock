// Use WASD and the Arrow Keys to Move

// Black barriers/obstacles cannot be passed at all
// You can pass through white barriers if you are a certain width
// All barriers send you to the start

// Confetti code by samchasan

var px = 200;
var py = 35;
var pw = 20;
var ph = 20;

var move = 3;

// Create the obstacles
var obstacles = [
  {x: 150, y: 100, w: 100, h: 15},   // Horizontal top obstacle
  {x: 100, y: 175, w: 15, h: 100},   // Vertical left obstacle
  {x: 300, y: 175, w: 15, h: 100},   // Vertical right obstacle
  {x: 150, y: 250, w: 100, h: 15},   // Horizontal bottom obstacle
  {x: 150, y: 350, w: 15, h: 100},   // Vertical bottom left obstacle
  {x: 250, y: 350, w: 15, h: 100},   // Vertical bottom right obstacle
  {x: 200, y: 120, w: 15, h: 50},    // Small vertical obstacle
  {x: 200, y: 300, w: 15, h: 50},    // Another small vertical obstacle
  {x: 50, y: 200, w: 50, h: 15},    // New obstacle near the left side
  {x: 350, y: 200, w: 50, h: 15},    // New obstacle near the right side
];

// Green, blue, and purple levels with new positions
var gb1x = 100;
var gb2x = 250;
var gb3x = 350;
var gby = 550;
var gbw = 15;
var gbh = 15;

var pbx = 200;
var pby = 550;
var pbw = 15;
var pbh = 15;
var pbs = 10;

var myBall = [];
var r = 5;
var canPassWhite = false; // Variable to track whether the player can pass white barriers

function setup() {
  createCanvas(800, 600); // Canvas size is 800x600 as described (400x600 + 400x400)

  for (var i = 0; i < 43; i++) {
    myBall.push(new Ball());
  }
}

function draw() {
  background(0);

  { // Colors for the map
    rectMode(CORNER);
    // Red
    fill(255, 105, 97);
    rect(0, 0, 400, 70);
    // Orange
    fill(255, 150, 99);
    rect(0, 70, 400, 70);
    // Yellow
    fill(255, 238, 134);
    rect(0, 140, 400, 70);
    // Green
    fill(182, 255, 139);
    rect(0, 210, 400, 70);
    // Blue
    fill(164, 222, 255);
    rect(0, 280, 400, 70);
    // Purple
    fill(211, 166, 255);
    rect(0, 350, 400, 70);
  }

  // Draw obstacles in the rectangular map (400x600)
  for (let obstacle of obstacles) {
    fill(0, 175);
    rectMode(RADIUS);
    rect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);

    // Check for collision with player
    if (px + pw > obstacle.x - obstacle.w && px - pw < obstacle.x + obstacle.w && py + ph > obstacle.y - obstacle.h && py - ph < obstacle.y + obstacle.h) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  }

  { // Green level (passable white barriers)
    fill(255, 175);
    ellipseMode(RADIUS);
    ellipse(gb1x, gby, gbw, gbh);

    ellipse(gb2x, gby, gbw, gbh);

    ellipse(gb3x, gby, gbw, gbh);

    if (px + pw > gb1x - gbw && px - pw < gb1x + gbw && py + ph > gby - gbh && py - ph < gby + gbh && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
    if (px + pw > gb2x - gbw && px - pw < gb2x + gbw && py + ph > gby - gbh && py - ph < gby + gbh && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
    if (px + pw > gb3x - gbw && px - pw < gb3x + gbw && py + ph > gby - gbh && py - ph < gby + gbh && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  }

  { // Blue level (a barrier to move across)
    fill(255, 175);
    rectMode(RADIUS);
    rect(250, 550, 250, 15);

    if (py > 540 && py < 570 && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  }

  { // Purple level (moving obstacle)
    fill(0, 175);
    ellipse(pbx, pby, pbw, pbh);
    pbx = pbx + pbs;
    if (pbx >= 800 || pbx <= 0) {
      pbs = -pbs;
    }
    if (px + pw > pbx - pbw && px - pw < pbx + pbw && py + ph > pby - pbh && py - ph < pby + pbh) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  }

  // Check if player can pass through the white barriers (green level)
  if (pw >= 40) {
    canPassWhite = true;
  } else {
    canPassWhite = false;
  }

  // Draw the status outside the box
  drawStatus();

  // Place elements here
  endzone();
  player();
}

// Draw the status ("X" or check mark)
function drawStatus() {
  fill(255);
  noStroke();
  textSize(32);
  textAlign(CENTER);

  if (canPassWhite) {
    text('✓', 250, 575); // Check mark when able to pass through white barriers
  } else {
    text('X', 250, 575); // "X" when unable to pass
  }
}

// Place functions here
function player() {
  fill(255);
  noStroke();
  rectMode(RADIUS);
  rect(px, py, pw, ph);

  { //WASD
    if (keyIsDown(87)) { // W key (move up)
      py = constrain(py - move, ph / 2, height - ph / 2);
    } else if (keyIsDown(83)) { // S key (move down)
      py = constrain(py + move, ph / 2, height - ph / 2);
    } else if (keyIsDown(65)) { // A key (move left)
      px = constrain(px - move, pw / 2, width - pw / 2);
    } else if (keyIsDown(68)) { // D key (move right)
      px = constrain(px + move, pw / 2, width - pw / 2);
    }
  } // WASD

  { // Arrows
    if (keyIsDown(UP_ARROW)) { // Up arrow (decrease height)
      ph = constrain(ph - move, 1, height);
    } else if (keyIsDown(DOWN_ARROW)) { // Down arrow (increase height)
      ph = constrain(ph + move, 1, height);
    } else if (keyIsDown(LEFT_ARROW)) { // Left arrow (decrease width)
      pw = constrain(pw - move, 1, width);
    } else if (keyIsDown(RIGHT_ARROW)) { // Right arrow (increase width)
      pw = constrain(pw + move, 1, width);
    }
  } // Arrows

  { // Size barrier (ensuring the player shape doesn't shrink too much)
    if (ph <= 1) {
      ph = ph + move;
    } else if (pw <= 1) {
      pw = pw + move;
    }
  } // Size barrier
}

function endzone() {
  fill(100, 100, 100, 80);
  noStroke();
  rectMode(CORNER);
  rect(400, 400, 400, 200); // Adjusted to create the end zone on the right

  if (px > 750 && py > 500) {
    win();
  }
}

function win() {
  textAlign(CENTER);
  textSize(55);
  textFont('Comic Sans MS');
  fill(0, 115);
  text('You Win!', 550, 300);

  for (var i = 0; i < myBall.length; i++) {
    myBall[i].display();
    myBall[i].move();
    myBall[i].bounce();
  }
}

class Ball {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.xspeed = random(2, 5);
    this.yspeed = random(2, 5);
  }

  display() {
    var color1 = random(255);
    var color2 = random(255);
    var color3 = random(255);
    noStroke();
    fill(color1, color2, color3);
    ellipse(this.x, this.y, r * 2, r * 2);
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  bounce() {
    if (this.x > width - r || this.x < r) {
      this.xspeed = -this.xspeed;
    }

    if (this.y > height - r || this.y < r) {
      this.yspeed = -this.yspeed;
    }
  }
}
