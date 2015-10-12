$(function(){
  var ballTimer;
  var dt = 1;
  var maxX = 800;
  var maxY = 600;

  var maxRadius = 100;
  var playerWidth = $("#p1").width();
  var playerHeight = $("#p1").height();
  var ballRadius = $("#pika").width();
  var playerPos = $("#p1").offset();
  var ballPos = $("#pika").offset();
  var radius = 0;
  var computeXY = {x:0,y:0};



  var count = 0;

  var pika = {
    x:0,
    y:100,
    Vx: -30,
    Vy:-10,
    stop:false
  };

  $("#p1").offset({
    top: maxY - 150,
    left: 400
  });

  function rules(){
    var playerPos = $("#p1").offset();
    var ballPos = $("#pika").offset();

    if (pika.x<=0 || pika.x >= maxX){
      pika.Vx = pika.Vx * -1;
    };
    if (pika.y == 0 || pika.y >= maxY){
      pika.Vy = pika.Vy * -1;
    };

    if (hitRadius(playerPos,ballPos)){
      pika.Vx = pika.Vx * -1;
      pika.Vy = pika.Vy * -1;
    }

    pika.x = pika.x + pika.Vx * dt;
    pika.y = pika.y + pika.Vy * dt;

    update(pika.x,pika.y);
  }

  var p1 = {
    x: 0, y:0
  };
  var p2 = {
    x: 0, y:0
  };

  function unifyPlayer(playerName){ //adjust the reference point
    var tmp = $("#" + playerName);

    if (playerName == "p1"){
      p1.y = tmp.offset().top + playerHeight * 0.5;
      p1.x = tmp.offset().left + playerWidth * 0.8;
    };
    if (playerName == "p2"){
      p2.y = tmp.offset().top + playerHeight * 0.5;
      p2.x = tmp.offset().left + playerWidth * 0.2;
    };
  }

  function hitRadius(player,ball){
    //check if player inside radius of ball hit
    unifyPlayer("p1");

    var x = p1.x;
    var y = p1.y;

    var ballx = ball.left + ballRadius * 0.5;
    var bally = ball.top  + ballRadius * 0.5;

    radius = Math.sqrt(Math.pow(ballx-x,2) + Math.pow(bally-y,2));

    if (radius <= maxRadius){
      console.log("HIT!!");
      computeXY.x = ballx - x;
      computeXY.y = bally - y;
      return true;
    }
  }

  function rules_bounceOff(angle){
    if (pika.x<=0 || pika.x >= maxX){
      pika.Vx = pika.Vx * -1;
    };
    if (pika.y == 0 || pika.y >= maxY){
      pika.Vy = pika.Vy * -1;
    };

    pika.x = pika.x + pika.Vx * dt;
    pika.y = pika.y + pika.Vy * dt;

    update(pika.x,pika.y);
  }

  function update(x,y){
    $("#pika").offset({
      top : y,
      left : x
    });
  }


  function setTimer(){
    ballTimer = setInterval(rules,10);
  }

  setTimer();

  $(document).keydown(function(e){
    //if return (keycode=13)
    if (e.which == 13) {
      if(pika.stop == false){
        console.log("X = " + pika.x + " Y = " + pika.y);
        clearInterval(ballTimer);
        pika.stop = true;

        playerPos = $("#p1").offset();
        ballPos = $("#pika").offset();

        hitRadius(playerPos,ballPos);
      }else{
        pika.stop = false;
        setTimer();
      }
    };

    var p1Pos = $("#p1").offset();
    if(e.which == 38){
    }
  });

});