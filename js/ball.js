// Ball [PROPERTIES] //
var Ball = function(){
  this.dt = 1; // L3 [bouncing]
  this.bouncing_t = 0; // L6 [trajectory]
  this.radiusRange = 80; // L9 [function hitRadius]
  this.ballRadius = 100; // L12
  this.position = { x: null, y: null}; // L14
  this.velocity = { x: 0, y: -5}; // L21 + L22 [PLS CHECK if it works]
  this.up = false; // L24
  this.hit = false; // == this.exc //L25
  this.init_pos = { x: null, y: null}; // L26 + L27 [PLS CHECK if it works]
  this.init_vel = 80;
  this.angle = 0;
  this.g = 5; // [sensitivity parameter]
  this.idName = "#pika"; // <-DOM id
  this.t = 0; // timer for trajectory motion
  // this.CURRENT_PLAYER = "p1";
};

// Ball [METHODS] //
Ball.prototype.initialize = function(game){
  var curr_player = game.CURRENT_PLAYER;
  if (curr_player == "p1"){
    this.position.x = game[curr_player].position.x + 90;
  } else if (curr_player == "p2"){
    this.position.x = game[curr_player].position.x - 90;
  };
  this.position.y = 0;
}

function setBounceTimer(){
  ballTimer = setInterval(bounceRules,10);
};

function bounceRules(){
  if (game.ball.position.x <= 0 + game.COURT_LIMIT.x){
      game.ball.velocity.x *= -1;
      game.ball.position.x += 10;
  }else if(game.ball.position.x >= game.COURT_LIMIT.x + game.COURT_SIZE.width){
      game.ball.velocity.x *= -1;
      game.ball.position.x -=10;
  };
  if (game.ball.position.y <= 0 + game.COURT_LIMIT.y){
      game.ball.velocity.y *= -1;
      game.ball.position.y +=10;
  }else if(game.ball.position.y >= game.COURT_LIMIT.y + game.COURT_SIZE.height - game.ball.ballRadius){
      game.ball.velocity.y *= -1;
      game.ball.position.y -= 10;
      addPoint();
      clearInterval(ballTimer);
  };

  if (hitRadius(game.ball.radiusRange) !== undefined){
    game.ball.velocity.x *= -1;
    game.ball.velocity.y *= -1;
  };

  game.ball.position.x += game.ball.velocity.x * game.ball.dt;
  game.ball.position.y += game.ball.velocity.y * game.ball.dt;

  game.ball.updatePos();
}
function resetBounceTimer (){
  ballTimer2 = setInterval(resetBounceRules,10);
};

function setTrajTimer (){
  game.ball.t = 0;
  trajTimer = setInterval(trajectory,10);
}

function resetBounceRules (){
  // var curr_player = game.CURRENT_PLAYER;
  // var player_POSITION = game[curr_player].position; // [CHANGE LATER]
  if (game.ball.position.x <= 0 + game.COURT_LIMIT.x){
    game.ball.velocity.x *= -1;
    game.ball.position.x += 5;
  }else if(game.ball.position.x >= game.COURT_LIMIT.x + game.COURT_SIZE.width - game.ball.ballRadius){
    game.ball.velocity.x *= -1;
    game.ball.position.x -= 5;
  };
  if (game.ball.position.y <= 0 + game.COURT_LIMIT.y){
    game.ball.velocity.y *= -1;
    game.ball.position.y += 5;
  }else if(game.ball.position.y >= game.COURT_LIMIT.y + game.COURT_SIZE.height - game.ball.ballRadius){
    game.ball.velocity.y *= -1;
    game.ball.position.y -=5;
    addPoint();
    clearInterval(ballTimer2);
    // console.log(game.SCORE_TAKER);
    // game[game.SCORE_TAKER].score++;
    // console.log(game[game.SCORE_TAKER].score);
  };
  if (hitRadius(game.ball.radiusRange) !== undefined){
    game.ball.velocity.x *= -1;
    game.ball.velocity.y *= -1;
  };

  game.ball.position.x +=game.ball.velocity.x * game.ball.dt;
  game.ball.position.y += game.ball.velocity.y * game.ball.dt;

  game.ball.updatePos(); // Associated with setBounceTimer
}


function initTrajectory (trajElement){
  //input from hitRadius as an object traj_XY.x traj_XY.y
  game.ball.angle = Math.atan(trajElement.y / trajElement.x);
  game.ball.velocity.x = game.ball.init_vel * Math.cos(game.ball.angle);
  game.ball.velocity.y = game.ball.init_vel * Math.sin(game.ball.angle);
  game.ball.init_pos.x = game.ball.position.x;
  game.ball.init_pos.y = game.ball.position.y;
  if (trajElement.x < 0 && trajElement.y < 0){ // ball at 4th qua of the player
    game.ball.velocity.x *= -1;
    game.ball.velocity.y *= -1;
  } else if(trajElement.x < 0 && trajElement.y > 0) {
    game.ball.velocity.x *= -1;
    game.ball.velocity.y *= -1;
  };// (upstream of hitRadius) [for hitRadius]
}

function trajectory (){
  game.ball.t += 0.25;
  game.ball.position.x = game.ball.init_pos.x + game.ball.velocity.x * game.ball.t;
  game.ball.position.y = game.ball.init_pos.y + game.ball.velocity.y * game.ball.t + 0.5 * game.ball.g * Math.pow(game.ball.t,2);

  game.ball.updatePos();

  if (checkGround()){
    addPoint();
    clearInterval(trajTimer);
    // game[game.SCORE_TAKER].score++;
  };
  if (checkBoundary()){
    game.ball.t = 0;
    game.ball.velocity.x *= 0.2;
    game.ball.velocity.y *= 0.2;
    resetBounceTimer();
    clearInterval(trajTimer);
  } // Associated with setTrajTimer
}

Ball.prototype.unifyPosition = function(){
  var tmp = {};
  tmp.x = this.position.x + this.ballRadius * 0.5;
  tmp.y = this.position.y + this.ballRadius * 0.5;
  return tmp;
};

Ball.prototype.updatePos = function(){
  $(this.idName).offset({
    top : this.position.y ,
    // left : this.position.x + $("#player1").offset().left - game.COURT_SIZE.width / 2
    left : this.position.x
  })
};


function checkGround(){
  // return game.ball.position.y >= game.COURT_SIZE.height - game.ball.ballRadius? true : false;
  return game.ball.position.y >= game.thresholdLevel? true : false;
}

function checkBoundary(){
  if (game.ball.position.x - game.COURT_LIMIT.x<=0 || game.ball.position.x >= game.COURT_SIZE.width + game.COURT_LIMIT.x){
    game.ball.velocity.x *= -1;
    return true;
  };
  if (game.ball.position.y - game.COURT_LIMIT.y <=0 || game.ball.position.y >= game.COURT_SIZE.height + game.COURT_LIMIT.y - game.ball.ballRadius){
    game.ball.velocity.y *= -1;
    return true;
  };
}