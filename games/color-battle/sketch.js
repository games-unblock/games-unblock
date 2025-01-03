let game = 200

function setup() {
    createCanvas(400, 400);
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

