//Use WASD and the Arrow Keys to Move

//Black barriers/obstacles cannot be passed at all
//You can pass through white barriers if you are a certain width
//All barriers send you to the start

//Confetti code by samchasan

var px = 200;
var py = 35;
var pw = 20;
var ph = 20;

var move = 3;

var obx = 200;
var oby = 105;
var obw = 100;
var obh = 15;

var yblx = 95;
var ybly = 175;
var yblw = 95;
var yblh = 15;

var ybrx = 305;
var ybry = 175;
var ybrw = 95;
var ybrh = 15;

var gb1x = 60;
var gb2x = 200;
var gb3x = 340;
var gby = 245;
var gbw = 15;
var gbh = 15;

var pbx = 200;
var pby = 385;
var pbw = 15;
var pbh = 15;
var pbs = 10;

var myBall = [];
var r = 5;
var canPassWhite = false; // Variable to track whether the player can pass white barriers

function setup() {
  createCanvas(400, 490);

  for (var i = 0; i<43; i++){
    myBall.push(new Ball());
  }
}

function draw() {
  background(0);
  {rectMode(CORNER);
    //red
    fill(255,105,97);
    rect(0,0,400,70);
    //orange
    fill(255,150,99);
    rect(0,70,400,70);
    //yellow
    fill(255,238,134);
    rect(0,140,400,70);
    //green
    fill(182,255,139);
    rect(0,210,400,70);
    //blue
    fill(164,222,255);
    rect(0,280,400,70);
    //purple
    fill(211,166,255);
    rect(0,350,400,70);
  } //colors

  { //orange level
    fill(0,175);
    rectMode(RADIUS);
    rect(obx, oby, obw, obh);

    if (px+pw > obx-obw && px-pw < obx+obw && py+ph > oby-obh && py-ph < oby+obh) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  } //orange level

  { //yellow level
    fill(0,175);
    rectMode(RADIUS);
    rect(yblx,ybly,yblw,yblh);

    if (px+pw > yblx-yblw && px-pw < yblx+yblw && py+ph > ybly-yblh && py-ph < ybly+yblh) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }

    fill(0,175);
    rectMode(RADIUS);
    rect(ybrx,ybry,ybrw,ybrh);

    if (px+pw > ybrx-ybrw && px-pw < ybrx+ybrw && py+ph > ybry-ybrh && py-ph < ybry+ybrh) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  } //yellow level

  { //green level
    fill(255,175);
    ellipseMode(RADIUS);
    ellipse(gb1x, gby, gbw, gbh);

    ellipse(gb2x, gby, gbw, gbh);

    ellipse(gb3x, gby, gbw, gbh);

    if (px+pw > gb1x-gbw && px-pw < gb1x+gbw && py+ph > gby-gbh && py-ph < gby+gbh && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
    if (px+pw > gb2x-gbw && px-pw < gb2x+gbw && py+ph > gby-gbh && py-ph < gby+gbh && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
    if (px+pw > gb3x-gbw && px-pw < gb3x+gbw && py+ph > gby-gbh && py-ph < gby+gbh && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  } //green level

  {
    fill(255,175);
    rectMode(RADIUS);
    rect(200, 315, 200, 15);

    if (py > 300 && py < 330 && pw < 40) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  } //blue level

  { //purple level
    fill(0,175);
    ellipse(pbx,pby,pbw,pbh);
    pbx = pbx + pbs;
    if (pbx >= 400 || pbx <= 0) {
      pbs = -pbs;
    }
    if (px+pw > pbx-pbw && px-pw < pbx+pbw && py+ph > pby-pbh && py-ph < pby+pbh) {
      px = 200;
      py = 35;
      pw = 20;
      ph = 20;
    }
  } //purple level

  // Check if player can pass through the white barriers (green level)
  if (pw >= 40) {
    canPassWhite = true;
  } else {
    canPassWhite = false;
  }

  // Draw the status outside the box
  drawStatus();

  //place elements here
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
    text('✓', 200, 475); // Check mark when able to pass through white barriers
  } else {
    text('X', 200, 475); // "X" when unable to pass
  }
}

//place functions here
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
  fill(100,100,100,80);
  noStroke();
  rectMode(CORNER);
  rect(0,420,400,70);

  if (py > 420) {
    win();
  }
}

function win() {
  textAlign(CENTER);
  textSize(55);
  textFont('Comic Sans MS');
  fill(0,115);
  text('you   win!', 204, 260);

  for (var i = 0; i< myBall.length; i++){
    myBall[i].display();
    myBall[i].move();
    myBall[i].bounce();
  }
}

class Ball {

  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.xspeed = random(2,5);
    this.yspeed = random(2,5);
  }

  display() {
    var color1 = random(255);
    var color2 = random(255);
    var color3 = random(255);
    noStroke();
    fill(color1,color2,color3)
    ellipse(this.x, this.y, r*2, r*2);
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
