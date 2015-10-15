var game;
$(function(){
  game = new Game();
  //Initialize
  game.initialize();
  //Register Event for Keys
  var KEY_CODE = {
    // LEFT
    87: { action: "up", player: "p1", on: false },
    65: { action: "left", player: "p1", on: false },
    68: { action: "right", player: "p1", on: false },
    32: { action: "hit", player: "p1", on: false },
    // RIGHT
    38: { action: "up", player: "p2", on: false },
    37: { action: "left", player: "p2", on: false },
    39: { action: "right", player: "p2", on: false },
    13: { action: "hit", player: "p2", on: false },
  };

  function guideOffHover(){
    $("#userGuide").css({'z-index':-2});
  }

  $("td.userJump").hover(function(){
    $("#userGuide").css({'z-index':2})
    .html("<span>" + "JUMP" + "</span>")
  },guideOffHover);
  $("td.userLeft").hover(function(){
    $("#userGuide").css({'z-index':2})
    .html("<span>" + "LEFT" + "</span>")
  },guideOffHover);
  $("td.userRight").hover(function(){
    $("#userGuide").css({'z-index':2})
    .html("<span>" + "RIGHT" + "</span>")
  },guideOffHover);
  $("td.userHit").hover(function(){
    $("#userGuide").css({'z-index':2})
    .html("<span>" + "SPIKE!" + "</span>")
  },guideOffHover);


  $("#instruction").offset({
    top: $("#court").offset().top,
    left: $("#court").offset().left
  });

  var animateTimer = setInterval(animateStart,1200);
  count = 0
  function animateStart(){
    count++;
    jBeep('./audio/pika4.wav');
    $("#starterImage").animate({
      width:500
    },500,function(){
      $("#starterImage").animate({
        width:400
      },500)});
    if (count>10 || game.START){clearInterval(animateTimer)}
  };

  $("#pika").css({opacity:0});
  $("#start").on("click",initiate);

    myAudio = new Audio('./audio/bg.wav');
    myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

  function initiate(){
    $("#instruction").css({'z-index':-1})
    myAudio.play();

    $( "#court" ).animate({
      opacity: 1
    }, 1000);
    if (!game.START){
      game.START = true;
      var countDown = 3;
      $("#countdown").html(countDown);
      jBeep('./audio/pikachu.wav');
      var countdownTimer = setInterval(function(){
        countDown--;
        $("#countdown").html(countDown);
        if (countDown <= 0){
          setBounceTimer();
        $("#countdown").html("");
          clearInterval(countdownTimer);
        }},1000);
    };
  };

    adjustHiddenDivision("countdown");
    adjustHiddenDivision("gameOver");

    function adjustHiddenDivision(name){
      var topLevel = Math.max(0, (($(window).height() - $($("#" + name)).outerHeight()) / 4) +
         $(window).scrollTop()) + "px";
      var leftLevel = Math.max(0, (($(window).width() - $($("#" + name)).outerWidth()) / 2.3) +
        $(window).scrollLeft()) + "px";

        $("#" + name).css("position","absolute");
        $("#" + name).css("top", topLevel);
        $("#" + name).css("left", leftLevel);
    }

    $( window ).resize(function() {
      adjustHiddenDivision("countdown");
      adjustHiddenDivision("gameOver");
    });

  // $("#test").offset({
  //   top: game.COURT_LIMIT.y + game.COURT_SIZE.height - game.NET_HEIGHT,
  //   left:game.COURT_LIMIT.x + game.COURT_SIZE.width/2 - game.NET_WIDTH/2
  // })

  Object.observe(game.ball.position, function(changes) {
    playerTurn(game.ball.position.x);
    if (touchNet()){
      // timerList.forEach(function(e){
      //   clearInterval(e);
      //   removeTimer(e);
      //   // addPoint();
      // })
      jBeep("./audio/smash.wav");
      clearInterval(ballTimer2);
      clearInterval(ballTimer);
      clearInterval(jumpUp);
      clearInterval(trajTimer);
      addPoint();
    };
  });

  var sideOps = {
    p1: game.ball.ballRadius,
    p2: 0
  };

  function touchNet(){
    var increment = sideOps[game.CURRENT_PLAYER];
    var lowerLimit = game.COURT_LIMIT.x + game.COURT_SIZE.width/2 - game.NET_WIDTH/2 - increment;
    var upperLimit = game.COURT_LIMIT.x + game.COURT_SIZE.width/2 + game.NET_WIDTH/2 - increment;
    if (game.ball.position.x > lowerLimit && game.ball.position.x < upperLimit){
      if (game.ball.position.y > game.COURT_LIMIT.y + game.COURT_SIZE.height - game.NET_HEIGHT){
        return true;
      }
    }
  };

  function playerTurn (ball_x){
    if (ball_x < (game.COURT_LIMIT.x + game.COURT_SIZE.width) / 2){
      game.CURRENT_PLAYER = "p1";
      game.SCORE_TAKER = "p2";
    } else {
      game.CURRENT_PLAYER = "p2";
      game.SCORE_TAKER = "p1";
    }
  };

  function is_x_out_LEFT(player){
    switch(player){
      case "p1":
        if ($("#" + player).offset().left <= 0 + game.COURT_LIMIT.x){
          return true;
        };
        break;
      case "p2":
        if ($("#" + player).offset().left <= game.COURT_SIZE.width / 2 + game.COURT_LIMIT.x){
          return true;
        };
        break;
    }
  }
  function is_x_out_RIGHT(player){
    switch(player){
      case "p1":
        if ($("#" + player).offset().left >= game.COURT_SIZE.width / 2 + game.COURT_LIMIT.x - game[player].dimension.width){
          return true;
        };
        break;
      case "p2":
        if ($("#" + player).offset().left >= game.COURT_SIZE.width + game.COURT_LIMIT.x - game[player].dimension.width){
          return true;
        };
        break;
    }
  }
  function is_y_out(player){
    if ($("#" + player).offset().top >= game.COURT_SIZE.height - this.dimension.height - 50 + game.COURT_LIMIT.y){
      return true;
    }
  }

  $(document).keydown(function(e){
    // 1. Key Code + CurrentPlayer
    if (e.which in KEY_CODE){
      KEY_CODE[e.which].on = true;

      switch(KEY_CODE[e.which].action){
        case "up":
          if (game[KEY_CODE[e.which].player].up == false){
            game[ KEY_CODE[e.which].player ].up = true;
            game[ KEY_CODE[e.which].player ].position.x = $("#" + KEY_CODE[e.which].player ).offset().left;
            game[ KEY_CODE[e.which].player ].position.y = $("#" + KEY_CODE[e.which].player ).offset().top;
            jumpEvent(KEY_CODE[e.which].player);
          }
          break;

        case "left":
          if (!is_x_out_LEFT(KEY_CODE[e.which].player)){
            $("#" + KEY_CODE[e.which].player).offset({
              left: $("#" + KEY_CODE[e.which].player).offset().left - 20
            });
          }
          break;

        case "right":
          if (!is_x_out_RIGHT(KEY_CODE[e.which].player)){
            $("#" + KEY_CODE[e.which].player ).offset({
              left: $("#" + KEY_CODE[e.which].player ).offset().left + 20
            });
          }
          break;

        case "hit":
          if (KEY_CODE[e.which].player == game.CURRENT_PLAYER){
            if (game.ball.hit == false){
              game.ball.hit = true;
              if (hitRadius(200)){
                console.log("HIT by Return!!!");
                jBeep("./audio/pi.wav");
                console.log("At: x=" + $("#pika").offset().left + " y=" + $("#pika").offset().top);
                clearInterval(ballTimer);
                initTrajectory(init_traj);
                setTrajTimer();
              };
              game.ball.hit = false;
            };
          }
          break;
      }
    };

    $("#restart").on("click",function(){
      document.location.reload(true);
      initiate();
    });


    // if (e.which == 32){
    //   clearInterval(ballTimer);
    //   clearInterval(trajTimer);
    // };
  });

});