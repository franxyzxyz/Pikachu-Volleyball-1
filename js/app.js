$(function(){
  var game = new Game();

  var timer;
  var objectPos = $(".fetchPosition");

  var ballPos = $("#pokeball").offset();

  var p1Pos = $("#p1").offset();
  var p1Default = $("#player1").offset(); // [CHANGE LATER] for testing purpose
  var playerSize = $("#p1").width();//<-tbc: game.js define
  var canvas = $("#court").offset();

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

  console.log("Ball x: " + ballPos.left + " y: " + ballPos.top);
  console.log("Player One x: "+ p1Pos.left + " y: " + p1Pos.top);
  console.log("Canvas x: "+ canvas.left + " y: " + canvas.top);

  $(document).keydown(function(e){
    var p1Pos = $("#p1").offset();
    if(e.which == 38){
      // trigger Up event (only if x = 0)
      $("#p1").offset({
        top: p1Pos.top - 30
      });
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


});

