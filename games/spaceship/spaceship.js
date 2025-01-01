var pxlfont;
//Font Used:"Press Start 2P" by Cody "CodeMan38" Boisclair.
//Font Link:https://fonts.google.com/specimen/Press+Start+2P
var stage;

{ //Player Base & Movement Variables

  var px = 200;
  var pmove = 5;

  var phh = 150;
  var phy = 300;
  var phmove = 0.6;

  var pbr = 237;
  var pbl = 157;
  var pbw = 5;
  var pbh = 440;
  var pbo = 0;

  var pso = 0;

} //Player Base & Movement Variables

{ //Enemy Control Variables

  var emx = 200;
  var emmove = 5;

  var emhh = 150;
  var emhy = 50;
  var emhmove = 0.6;

  var embr = 237;
  var embl = 157;
  var embw = 5;
  var embh = 440;
  var embo = 0;

  var emso = 0;

} //Enemy Control Variables

{ //Enemy Base Variables

  var ex = 50;
  var emove = 2;

  var ehh = 150;
  var ehy = 50;
  var ehmove = 0.15;

} //Enemy Base Variables

{ //Enemy Stage 1 Variables

  var es1o = 0;
  var es2o = 0;
  var es3o = 0;
  var es4o = 0;
  var es5o = 0;

  var es1y = 80;
  var es2y = 80;
  var es3y = 80;
  var es4y = 80;
  var es5y = 80;

  var esh = 20;
  var esw = 5;
  var esmove = 30;

} //Enemy Stage 1 Variables

{ //Enemy Stage 2 Variables

  var err = 10;
  var err2 = 10;
  var ermove = 5;
  var ermove2 = 2;

} //Enemy Stage 2 Variables

{ //Enemy Drones Variables

  var edr1x = 40;
  var edr2x = 360;
  var edr1move = 1;
  var edr2move = 6;

} //Enemy Drones Variables

function preload() {
  pxlfont = loadFont('pixelfont.ttf');
}

function setup() {
  createCanvas(475, 500);
}

function draw() {
  startMenu();

  if (stage == 1) {
    startMenu();
  }

  if (stage == 2) {
    singleStartMenu();
  }

  if (stage == 3) {
    gameBackground();

    playerSingleControl();
    playerBase();

    enemyBase();
    enemySingleMove();

    if (ehy >= 50 && ehy < 100) {
      enemyStageA();
    }

    if (ehy >= 100 && ehy < 150) {
      enemyStageB();
    }

    if (ehy >= 150 && ehy < 200) {
      enemyDrones();
      enemyStageC();
    }

    playerSingleHealth();
    enemySingleHealth();

  }

  if (stage == 4) {
    multiStartMenu();
  }

  if (stage == 5) {
    gameBackground();

    playerMultiControl();
    playerBase();

    enemyMultiControl();
    enemyMultiBase();

    playerMultiHealth();
    enemyMultiHealth();

  }

}


function playerBase() {
  rectMode(RADIUS);
  ellipseMode(RADIUS);
  noStroke();
  fill(200);
  rect(px, 440, 50, 10);
  fill(184, 255, 255);
  ellipse(px, 428, 30, 12);
  fill(150);
  rect(px - 40, 440, 5, 15);
  rect(px + 40, 440, 5, 15);
  fill(255);
  triangle(px, 470, px + 30, 430, px - 30, 430);
  fill(150);
  quad(px - 10, 465, px + 10, 465, px + 20, 480, px - 20, 480);
  fill(255, 115, 52);
  triangle(px - 10, 480, px + 10, 480, px, (random(480, 500)));

}

function playerSingleHealth() {
  rectMode(CORNER);
  noStroke();

  fill(0);
  rect(400, 0, 75, 500);

  fill(255, 0, 0);
  rect(425, 300, 25, 150);

  fill(0, 255, 0);
  rect(425, phy, 25, phh);

  if (phh <= 0) {
    phh = 0;
    phy = 450;

    fill(255, 0, 0);
    textSize(30);
    textFont(pxlfont);
    textAlign(CENTER);
    text('GAME OVER', 200, height / 2);
    textSize(15);
    text('Press "r" to Restart', 205, (height / 2) + 30);
    text('or "m" to go to Menu', 205, (height / 2) + 50);

    pbo = 0;
    pso = 0;

  }

}

function playerSingleControl() {
  { //MOVEMENT
    if (keyIsDown(LEFT_ARROW)) {
      px = px - pmove;
      pbr = pbr - pmove;
      pbl = pbl - pmove;
    } else if (keyIsDown(RIGHT_ARROW)) {
      px = px + pmove;
      pbr = pbr + pmove;
      pbl = pbl + pmove;
    }

    if (px + 30 >= 380) {
      px = px - pmove;
      pbr = pbr - pmove;
      pbl = pbl - pmove;
    } else if (px - 30 <= 20) {
      px = px + pmove;
      pbr = pbr + pmove;
      pbl = pbl + pmove;
    }

  } //MOVEMENT

  { //BEAM

    fill(255, 163, 25, pbo);
    noStroke();
    rectMode(CORNER);
    rect(pbr, 0, pbw, pbh);
    rect(pbl, 0, pbw, pbh);

    if (keyIsDown('68')) {
      pbo = 200;
      pso = 0;
      pmove = 0;

    } else {
      pbo = 0;
      pmove = 5;
    }

  } //BEAM

  { //SHIELD
    if (keyIsDown('65')) {
      pso = 200;
      pbo = 0;
    } else {
      pso = 0;
    }

    fill(255, 163, 25, pso);
    beginShape();
    vertex(px - 30, 400);
    vertex(px + 30, 400);
    vertex(px + 60, 420);
    vertex(px + 45, 420);
    vertex(px + 30, 410);
    vertex(px - 30, 410);
    vertex(px - 45, 420);
    vertex(px - 60, 420);
    endShape(CLOSE);

  } //SHIELD

}

function playerMultiControl() {

  { //MOVEMENT
    if (keyIsDown(LEFT_ARROW)) {
      px = px - pmove;
      pbr = pbr - pmove;
      pbl = pbl - pmove;
    } else if (keyIsDown(RIGHT_ARROW)) {
      px = px + pmove;
      pbr = pbr + pmove;
      pbl = pbl + pmove;
    }

    if (px + 30 >= 380) {
      px = px - pmove;
      pbr = pbr - pmove;
      pbl = pbl - pmove;
    } else if (px - 30 <= 20) {
      px = px + pmove;
      pbr = pbr + pmove;
      pbl = pbl + pmove;
    }

  } //MOVEMENT

  { //BEAM

    fill(255, 163, 25, pbo);
    noStroke();
    rectMode(CORNER);
    rect(pbr, 0, pbw, pbh);
    rect(pbl, 0, pbw, pbh);


    if (keyIsDown(UP_ARROW)) {
      pbo = 200;
      pso = 0;
      pmove = 0;

    } else {
      pbo = 0;
      pmove = 5;
    }
  } //BEAM

  { //SHIELD
    if (keyIsDown(DOWN_ARROW)) {
      pso = 200;
      pbo = 0;

    } else {
      pso = 0;
    }

    fill(255, 163, 25, pso);
    beginShape();
    vertex(px - 30, 400);
    vertex(px + 30, 400);
    vertex(px + 60, 420);
    vertex(px + 45, 420);
    vertex(px + 30, 410);
    vertex(px - 30, 410);
    vertex(px - 45, 420);
    vertex(px - 60, 420);
    endShape(CLOSE);

  } //SHIELD

}

function playerMultiHealth() {

  rectMode(CORNER);
  noStroke();

  fill(0);
  rect(400, 0, 75, 500);

  fill(255, 0, 0);
  rect(425, 300, 25, 150);

  fill(0, 255, 0);
  rect(425, phy, 25, phh);

  if (embr > px - 40 && embr < px + 40 && embo == 200 && pso == 0) {
    phy = phy + phmove;
    phh = phh - phmove;
  } else if (embl > px - 40 && embl < px + 40 && embo == 200 && pso == 0) {
    phy = phy + phmove;
    phh = phh - phmove;
  }

  if (phh <= 0) {
    phh = 0;
    phy = 450;

    pbo = 0;
    pso = 0;

    emhh = 150;
    emhy = 50;

    strokeWeight(10);
    stroke(0);
    fill(255, 0, 0);
    textSize(25);
    textFont(pxlfont);
    textAlign(CENTER);
    text('Player 1 Wins!', 200, height / 2);
    noStroke();
    textSize(12);
    text('Press "r" to Restart', 205, (height / 2) + 30);
    text('or "m" to go to Menu', 205, (height / 2) + 50);

  }

}


function enemyBase() {
  rectMode(RADIUS);
  fill(0, 255, 240);
  triangle(ex - 9, 25, ex - 21, 25, ex - 15, (random(0, 25)));
  triangle(ex + 9, 25, ex + 21, 25, ex + 15, (random(0, 25)));
  fill(70);
  rect(ex - 15, 35, 6, 10);
  rect(ex + 15, 35, 6, 10);
  fill(120);
  quad(ex - 40, 60, ex - 40, 40, ex, 50, ex, 80);
  quad(ex + 40, 60, ex + 40, 40, ex, 50, ex, 80);
  fill(10);
  quad(ex, 90, ex - 30, 30, ex, 40, ex + 30, 30);
  fill(255, 0, 0);
  quad(ex, 75, ex - 10, 50, ex, 40, ex + 10, 50);

}

function enemySingleMove() {
  ex = ex + emove;

  if (ex + 20 >= 380 || ex - 20 < 20) {
    emove = -emove;
  }

}

function enemyMultiBase() {
  rectMode(RADIUS);
  fill(0, 255, 240);
  triangle(emx - 9, 25, emx - 21, 25, emx - 15, (random(0, 25)));
  triangle(emx + 9, 25, emx + 21, 25, emx + 15, (random(0, 25)));
  fill(70);
  rect(emx - 15, 35, 6, 10);
  rect(emx + 15, 35, 6, 10);
  fill(120);
  quad(emx - 40, 60, emx - 40, 40, emx, 50, emx, 80);
  quad(emx + 40, 60, emx + 40, 40, emx, 50, emx, 80);
  fill(70);
  rect(emx + 40, 60, 4, 10);
  rect(emx - 40, 60, 4, 10);
  fill(10);
  quad(emx, 90, emx - 30, 30, emx, 40, emx + 30, 30);
  fill(255, 0, 0);
  quad(emx, 75, emx - 10, 50, emx, 40, emx + 10, 50);

}

function enemyMultiControl() {
  { //MOVEMENT
    if (keyIsDown('65')) {
      emx = emx - emmove;
      embr = embr - emmove;
      embl = embl - emmove;
    } else if (keyIsDown('68')) {
      emx = emx + emmove;
      embr = embr + emmove;
      embl = embl + emmove;
    }

    if (emx + 30 >= 380) {
      emx = emx - emmove;
      embr = embr - emmove;
      embl = embl - emmove;
    } else if (emx - 30 <= 20) {
      emx = emx + emmove;
      embr = embr + emmove;
      embl = embl + emmove;
    }


  } //MOVEMENT

  { //BEAM

    fill(0, 255, 240, embo);
    noStroke();
    rectMode(CORNER);
    rect(embr, 50, embw, embh);
    rect(embl, 50, embw, embh);


    if (keyIsDown('83')) {
      embo = 200;
      emso = 0;
      emmove = 0;

    } else {
      embo = 0;
      emmove = 5;
    }
  } //BEAM

  { //SHIELD
    if (keyIsDown('87')) {
      emso = 200;
      embo = 0;

    } else {
      emso = 0;
    }

    fill(0, 255, 240, emso);
    beginShape();
    vertex(emx - 30, 105);
    vertex(emx + 30, 105);
    vertex(emx + 60, 85);
    vertex(emx + 45, 85);
    vertex(emx + 30, 95);
    vertex(emx - 30, 95);
    vertex(emx - 45, 85);
    vertex(emx - 60, 85);
    endShape(CLOSE);

  } //SHIELD

}

function enemyMultiHealth() {
  rectMode(CORNER);
  noStroke();

  fill(255, 0, 0);
  rect(425, 50, 25, 150);

  fill(0, 255, 0);
  rect(425, emhy, 25, emhh);

  if (pbr > emx - 40 && pbr < emx + 40 && pbo == 200 && emso == 0) {
    emhy = emhy + emhmove;
    emhh = emhh - emhmove;
  } else if (pbl > emx - 40 && pbl < emx + 40 && pbo == 200 && emso == 0) {
    emhy = emhy + emhmove;
    emhh = emhh - emhmove;
  }

  if (emhh <= 0) {
    emhh = 0;
    emhy = 450;

    emso = 0;
    embo = 0;

    phh = 150;
    phy = 300;

    strokeWeight(10);
    stroke(150);
    fill(184, 255, 255);
    textSize(25);
    textFont(pxlfont);
    textAlign(CENTER);
    text('Player 2 Wins!', 200, height / 2);
    noStroke();
    textSize(12);
    text('Press "r" to Restart', 205, (height / 2) + 30);
    text('or "m" to go to Menu', 205, (height / 2) + 50);


  }

}

function enemySingleHealth() {
  rectMode(CORNER);
  noStroke();

  fill(255, 0, 0);
  rect(425, 50, 25, 150);

  fill(0, 255, 0);
  rect(425, ehy, 25, ehh);

  if (pbr > ex - 40 && pbr < ex + 40 && pbo == 200) {
    ehy = ehy + ehmove;
    ehh = ehh - ehmove;
  } else if (pbl > ex - 40 && pbl < ex + 40 && pbo == 200) {
    ehy = ehy + ehmove;
    ehh = ehh - ehmove;
  }

  if (ehh <= 0) {
    ehh = 0;
    ehy = 450;

    es1o = 0;
    es2o = 0;
    es3o = 0;
    es4o = 0;
    es5o = 0;

    phh = 150;
    phy = 300;


    fill(0, 255, 0);
    textSize(30);
    textFont(pxlfont);
    textAlign(CENTER);
    text('YOU WIN!', 200, height / 2);
    textSize(15);
    text('Press "r" to Restart', 205, (height / 2) + 30);
    text('or "m" to go to Menu', 205, (height / 2) + 50);

  }

}

function enemyStageA() {

  { //Middle Shot
    if (ex > 180 && ex < 220) {

      ellipseMode(RADIUS);
      fill(0, 255, 240, es1o);
      ellipse(200, es1y, esw, esh);
      es1o = 200;

      es1y = es1y + esmove;

    } else {
      es1o = 0;
      es1y = 80;
    }

    if (200 > px - 50 && 200 < px + 50 && es1y >= 420 && es1o == 200 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
  } //Middle Shot

  { //Far Right Shot
    if (ex > 40 && ex < 80) {

      ellipseMode(RADIUS);
      fill(0, 255, 240, es2o);
      ellipse(60, es2y, esw, esh);
      es2o = 200;

      es2y = es2y + esmove;

    } else {
      es2o = 0;
      es2y = 80;
    }

    if (60 > px - 50 && 60 < px + 50 && es2y >= 420 && es2o == 200 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
  } //Far Right Shot

  { //Mid Right Shot
    if (ex > 110 && ex < 150) {

      ellipseMode(RADIUS);
      fill(0, 255, 240, es3o);
      ellipse(130, es3y, esw, esh);
      es3o = 200;

      es3y = es3y + esmove;

    } else {
      es3o = 0;
      es3y = 80;
    }

    if (130 > px - 50 && 130 < px + 50 && es3y >= 420 && es3o == 200 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
  } //Mid Right Shot

  { //Mid Left Shot
    if (ex > 250 && ex < 290) {

      ellipseMode(RADIUS);
      fill(0, 255, 240, es4o);
      ellipse(270, es4y, esw, esh);
      es4o = 200;

      es4y = es4y + esmove;

    } else {
      es4o = 0;
      es4y = 80;
    }

    if (270 > px - 50 && 270 < px + 50 && es4y >= 420 && es4o == 200 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
  } //Mid Left Shot

  { //Far Left Shot
    if (ex > 310 && ex < 360) {

      ellipseMode(RADIUS);
      fill(0, 255, 240, es5o);
      ellipse(340, es5y, esw, esh);
      es5o = 200;

      es5y = es5y + esmove;

    } else {
      es5o = 0;
      es5y = 80;
    }

    if (340 > px - 50 && 340 < px + 50 && es5y >= 420 && es5o == 200 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
  } //Far Left Shot

}

function enemyStageB() {

  if (ehy > 100 && ehy <= 125) {
    ex = 100;

    ellipseMode(RADIUS);
    noFill();
    stroke(0, 255, 240, 200);
    strokeWeight(5);
    ellipse(ex, 60, err);

    err = err + ermove;

    if (err >= 450) {
      err = 10;
    }

    if (err > 380 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }

  }

  if (ehy > 125 && ehy <= 150) {
    ex = 300;

    ellipseMode(RADIUS);
    noFill();
    stroke(0, 255, 240, 200);
    strokeWeight(5);
    ellipse(ex, 60, err);

    err = err + ermove;

    if (err >= 450) {
      err = 10;
    }

    strokeWeight(10);
    ellipse(ex, 60, err2);

    err2 = err2 + ermove2;

    if (err2 >= 450) {
      err2 = 10;
    }
    if (err > 380 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
    if (err2 > 380 && pso == 0) {
      phy = phy + phmove;
      phh = phh - phmove;
    }
  }

}

function enemyStageC() {

  if (edr1x > px - 40 && edr1x < px + 40 && pso == 0) {
    phy = phy + ehmove;
    phh = phh - ehmove;
  }
  if (edr2x > px - 40 && edr2x < px + 40 && pso == 0) {
    phy = phy + ehmove;
    phh = phh - ehmove;
  }


}

function enemyDrones() {

  rectMode(RADIUS);
  fill(0, 255, 240);
  rect(edr2x, 300, 5, 200);
  fill(0, 255, 240);
  triangle(edr2x - 5, 75, edr2x + 5, 75, edr2x, (random(60, 80)));
  fill(70);
  rect(edr2x, 80, 5, 5);
  fill(120);
  rect(edr2x, 100, 20, 5);
  fill(0);
  rect(edr2x, 100, 10, 20);
  fill(255, 0, 0);
  triangle(edr2x - 10, 120, edr2x + 10, 120, edr2x, 100);

  fill(0, 255, 240);
  rect(edr1x, 300, 5, 200);
  fill(0, 255, 240);
  triangle(edr1x - 5, 75, edr1x + 5, 75, edr1x, (random(60, 80)));
  fill(70);
  rect(edr1x, 80, 5, 5);
  fill(120);
  rect(edr1x, 100, 20, 5);
  fill(0);
  rect(edr1x, 100, 10, 20);
  fill(255, 0, 0);
  triangle(edr1x - 10, 120, edr1x + 10, 120, edr1x, 100);

  edr1x = edr1x + edr1move;
  edr2x = edr2x - edr2move;

  if (edr1x <= 20 || edr1x >= 380) {
    edr1move = -edr1move
  }
  if (edr2x <= 20 || edr2x >= 380) {
    edr2move = -edr2move
  }

}


function startMenu() {
  rectMode(CORNER);
  fill(0);
  rect(0, 0, 475, 500);

  noStroke();
  fill(0, 255, 240, 150);
  rect(-10, 70.5, 460, 8, 150);

  fill(255, 163, 25, 150);
  rect(25, 125.5, 460, 8, 150);

  fill(255);
  textAlign(CENTER);
  textFont(pxlfont);
  textSize(45);
  text('SPACE', width / 2, 100);
  text('SHOOTERS', width / 2, 155);

  textSize(18);
  text('designed and coded', width / 2, 190);
  text('by Sydney Gardner', width / 2, 215);

  textSize(25);
  text('How many Players?', width / 2, 300);

  textSize(30);
  text('One', 125, 375);
  text('Two', 350, 375);

  textSize(15);
  text('Press 1', 125, 410);
  text('Press 2', 350, 410);


  rectMode(RADIUS);




}

function singleStartMenu() {
  rectMode(CORNER);
  fill(0);
  rect(0, 0, 475, 500);

  noStroke();
  fill(0, 255, 240, 150);
  rect(-10, 41, 410, 8, 150);

  fill(255, 163, 25, 150);
  rect(75, 91, 410, 8, 150);

  fill(255);
  textAlign(CENTER);
  textFont(pxlfont);
  textSize(35);
  text('SPACE', width / 2, 65);
  text('SHOOTERS', width / 2, 115);
  textSize(25);
  text('Single Player', width / 2, 153);

  rectMode(RADIUS);

  fill(255);
  push();
  noFill(255);
  stroke(255);
  strokeWeight(5);
  rect(width / 2, 280, 170, 110);
  pop();

  textSize(20);
  text('How to Play', width / 2, 200);

  rect(width / 2, 205, 110, 1.5);

  textSize(13);
  text('Use Left and Right', width / 2, 236);
  text('Arrows to move.', width / 2, 253);

  text('Press "d" to shoot', width / 2, 286);
  text('Press "a" to block', width / 2, 324);

  text('There are Health Meters', width / 2, 358);
  text('on the right side', width / 2, 375);

  textSize(20);
  text('Press "P" to Play', width / 2, 430);

  textSize(10);
  text('*Capital Letter "P"*', width / 2, 450);

}

function multiStartMenu() {
  rectMode(CORNER);
  fill(0);
  rect(0, 0, 475, 500);

  noStroke();
  fill(0, 255, 240, 150);
  rect(-10, 41, 410, 8, 150);

  fill(255, 163, 25, 150);
  rect(75, 91, 410, 8, 150);

  fill(255);
  textAlign(CENTER);
  textFont(pxlfont);
  textSize(35);
  text('SPACE', width / 2, 65);
  text('SHOOTERS', width / 2, 115);
  textSize(25);
  text('Multi Player', width / 2, 153);

  rectMode(RADIUS);

  fill(255);
  push();
  noFill(255);
  stroke(255);
  strokeWeight(5);
  rect(125, 280, 100, 110);
  rect(350, 280, 100, 110);
  pop();

  textSize(20);
  text('Player 1', 125, 200);
  text('Player 2', 350, 200);

  rect(125, 205, 83, 1.5);
  rect(350, 205, 83, 1.5);

  textSize(10);
  text('Use Left and Right', 350, 235);
  text('Arrows to move.', 350, 250);

  text('Press Up Arrow', 350, 278);
  text('to shoot', 350, 293);

  text('Press Down Arrow', 350, 320);
  text('to block', 350, 335);

  text('You are the', 350, 360);
  text('bottom ship', 350, 374);



  text('Use "a and "d"', 125, 235);
  text('Arrows to move.', 125, 250);

  text('Press "s"', 125, 278);
  text('to shoot', 125, 293);

  text('Press "w"', 125, 320);
  text('to block', 125, 335);

  text('You are the', 125, 360);
  text('top ship', 125, 374);


  textSize(20);
  text('Press "B" to Begin', width / 2, 430);

  textSize(10);
  text('*Capital Letter "B"*', width / 2, 450);

}

function gameBackground() {
  background(0, 2, 87);
  rectMode(CORNER);
  fill(0);
  rect(400, 0, 75, 500);

  this.linedist = random(20, 40);

  for (var x = 0; x <= width - 75; x = x + linedist) {
    push();
    strokeWeight(2);
    stroke(255, 33);
    line(x, 0, x, 500);
    pop();

  }
}


function keyPressed() {
  if (key == 'r') {
    px = 200;
    phh = 150;
    phy = 300;
    pbr = 237;
    pbl = 157;

    ex = 50;
    ehh = 150;
    ehy = 50;

    emx = 200;
    emhh = 150;
    emhy = 50;
    embr = 237;
    embl = 157;

  } else if (key == 'P') {
    stage = 3;
  } else if (key == 'm') {
    stage = 1;
  } else if (key == '1') {
    stage = 2;
  } else if (key == '2') {
    stage = 4;
  } else if (key == 'B') {
    stage = 5;
  }

}
