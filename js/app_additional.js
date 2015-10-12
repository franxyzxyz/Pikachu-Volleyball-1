$(function(){
  var game = new Game();

  var timer;
  var objectPos = $(".fetchPosition");

  var ballPos = $("#pokeball").offset();

  var p1Pos = $("#p1").offset();
  var p1Default = $("#player1").offset();
  var playerSize = $("#p1").width();//<-tbc: game.js define
  var canvas = $("#court").offset();

  // For trajectory motion
  var t = 0;
  var g = 10;

  objectPos = Array.prototype.map.call(objectPos,function(elem){
      return $(elem).offset();
    });

  game.initialize(p1Default);

  var initialize = function(){
  //initialized Position
    $("#p1").offset({
      top: game.p1.position.y,
      left:game.p1.position.x
    })
    $("#p2").offset({
      top: game.p2.position.y,
      left:game.p2.position.x
    })
  };

  initialize();

  // For trajectory motion
  var defaultY = game.p1.position.y;
  var position = {
    x_0 : game.p1.position.x,
    y_0 : game.p1.position.y,
    Vx : 0,
    Vy : -100,
    up : false,
    exc : false,

    x : 0,
    y : 0
  };

  console.log("Ball x: " + ballPos.left + " y: " + ballPos.top);
  console.log("Player One x: "+ p1Pos.left + " y: " + p1Pos.top);
  console.log("Canvas x: "+ canvas.left + " y: " + canvas.top);

  $(document).keydown(function(e){
    var p1Pos = $("#p1").offset();
    if(e.which == 38 && position.up == false){
      position.up = true;
      jumpEvent();
    }else if(e.which == 40){
      $("#p1").offset({
        top: p1Pos.top + 30
      });
    }
  });

  function regKeyDownEvent(event){
    //event = keycode
  }

  $("#pokeball").on("click",function(){
    // console.log("hello");
    setTimer();
  });

  var everySecond = function (){
    var p1Pos = $("#p1").offset();
    // console.log(p1Pos.top);
    if (p1Pos.top>= canvas.top + game.basic.canvasSize.height - playerSize){
      clearInterval(timer);
    };

    $("#p1").offset({
      top: p1Pos.top + 10
    });
  }


  function setTimer(){
    timer = setInterval(everySecond,100);
  }

  function trajectory(){
    t+=0.25;
    position.x = position.x_0 + position.Vx * t;
    position.y = position.y_0 + position.Vy * t + 0.5 * g * t * t;
    $("#p1").offset({
      left:position.x,
      top:position.y
    });

    if (position.y > defaultY){
      clearInterval(jumpUp);
      t = 0;
      position.up=false;
    }
  }

  function jumpEvent(){
    jumpUp = setInterval(trajectory, 10);
  }
});

