var game
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

  setBounceTimer();

  Object.observe(game.ball.position, function(changes) {
    playerTurn(game.ball.position.x);
  });

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
        if ($("#" + player).offset().left >= game.COURT_SIZE.width + game.COURT_LIMIT.x){
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
          if (game[ KEY_CODE[e.which].player ].up == false){
            game[ KEY_CODE[e.which].player ].up = true;
            game.p1.position.x = $("#" + KEY_CODE[e.which].player ).offset().left;
            game.p1.position.y = $("#" + KEY_CODE[e.which].player ).offset().top;
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

    // if (e.which == 32){
    //   clearInterval(ballTimer);
    //   clearInterval(trajTimer);
    // };
  });


    // if (e.which == 32){
    //   clearInterval(ballTimer);
    //   clearInterval(trajTimer);
    // };
});