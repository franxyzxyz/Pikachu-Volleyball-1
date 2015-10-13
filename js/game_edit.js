var jumpUp, trajTimer, ballTimer;

var Game = function(){
  this.MAX_POINT = 2;
  this.SERVE = null; // randomize the start of first Server [ADD LATER] : prototype of Game
  this.COURT_SIZE = { width: 800, height: 600}; // width-height
  this.COURT_LIMIT = null;
  this.CURRENT_PLAYER = null;
  this.CURRENT_POINT = null;
  this.SCORE_TAKER = null;
  this.p1 = null;
  this.p2 = null;
  this.ball = null;
  this.score = {p1: 0,p2:0};
  // this.onTimer = null; [setTimer generic function]
};

Game.prototype.initialize = function(){
  this.p1 = new Player();
  this.p2 = new Player();
  this.ball = new Ball();
  this.p1.initialize(this, "p1",$("#player1").offset());
  this.p2.initialize(this, "p2",$("#player1").offset());
  this.CURRENT_PLAYER = "p1";
  this.SCORE_TAKER = "p2";
  this.COURT_LIMIT = $("#player1").offset().left;
  this.ball.initialize(this);
};

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

function resetBounceTimer (){
  ballTimer = setInterval(resetBounceRules,10);
};

function setTrajTimer (){
  game.ball.t = 0;
  trajTimer = setInterval(trajectory,10);
}

function resetBounceRules (){
  // var curr_player = game.CURRENT_PLAYER;
  // var player_POSITION = game[curr_player].position; // [CHANGE LATER]
  if (game.ball.position.x <= 0 + game.COURT_LIMIT){
    game.ball.velocity.x *= -1;
    game.ball.position.x += 5;
  }else if(game.ball.position.x >= game.COURT_LIMIT + game.COURT_SIZE.width - game.ball.ballRadius){
    game.ball.velocity.x *= -1;
    game.ball.position.x -= 5;
  };
  if (game.ball.position.y <= 0){
    game.ball.velocity.y *= -1;
    game.ball.position.y += 5;
  }else if(game.ball.position.y >= game.COURT_SIZE.height - game.ball.ballRadius){
    game.ball.velocity.y *= -1;
    game.ball.position.y -=5;
    clearInterval(ballTimer);
    // console.log(game.SCORE_TAKER);
    // game[game.SCORE_TAKER].score++;
      addPoint();
    // console.log(game[game.SCORE_TAKER].score);
  };
  if (hitRadius(game.ball.radiusRange) !== undefined){
    game.ball.velocity.x *= -1;
    game.ball.velocity.y *= -1;
  };

  game.ball.position.x += game.ball.velocity.x * game.ball.dt;
  game.ball.position.y += game.ball.velocity.y * game.ball.dt;

  game.ball.updatePos(); // Associated with setBounceTimer
}

function setBounceTimer(){
  ballTimer = setInterval(bounceRules,10);
};

var init_traj = {x: null, y:null};
function hitRadius (allowableRadius) {
  // unifyPlayer("p1") [TO BE ADDED]
  var player = game.CURRENT_PLAYER;
  game[player].unifyPlayer();
  // if (player == "p2"){console.log("p2")}else if(player == "p1"){console.log("p1")}; //TESTING PURPOSE [REMOVE LATER]
  var playerPosition = game[player].position;
  var ballPosition = game.ball.unifyPosition();
  var radius = Math.sqrt(Math.pow(ballPosition.x - playerPosition.x,2) + Math.pow(ballPosition.y - playerPosition.y,2));
  if (radius <= allowableRadius){
    console.log("THEY TOUCH!!");
    init_traj = {
      x: ballPosition.x - playerPosition.x,
      y: ballPosition.y - playerPosition.y
    };
    return init_traj// carrying the delta X and delta Y between ball and player {CAUTION: subsequent hitradius must be checked with undefined instead}
  }
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
    clearInterval(trajTimer);
    // game[game.SCORE_TAKER].score++;
    addPoint();
  };
  if (checkBoundary()){
    clearInterval(trajTimer);
    game.ball.t = 0;
    game.ball.velocity.x *= 0.2;
    game.ball.velocity.y *= 0.2;
    resetBounceTimer();
  } // Associated with setTrajTimer
}

Ball.prototype.unifyPosition = function(){
  var tmp = {};
  tmp.x = this.position.x + this.ballRadius * 0.5;
  tmp.y = this.position.y + this.ballRadius * 0.5;
  return tmp;
};

function bounceRules(){
  if (game.ball.position.x <= 0 + game.COURT_LIMIT){
      game.ball.velocity.x *= -1;
      game.ball.position.x += 10;
  }else if(game.ball.position.x >= game.COURT_LIMIT + game.COURT_SIZE.width){
      game.ball.velocity.x *= -1;
      game.ball.position.x -=10;
  };
  if (game.ball.position.y <= 0){
      game.ball.velocity.y *= -1;
      game.ball.position.y +=10;
  }else if(game.ball.position.y >= game.COURT_SIZE.height){
      game.ball.velocity.y *= -1;
      game.ball.position.y -= 10;
      clearInterval(ballTimer);
      addPoint();
  };
  if (hitRadius(game.ball.radiusRange) !== undefined){
    game.ball.velocity.x *= -1;
    game.ball.velocity.y *= -1;
  };

  game.ball.position.x += game.ball.velocity.x * game.ball.dt;
  game.ball.position.y += game.ball.velocity.y * game.ball.dt;

  game.ball.updatePos(); // Associated with setBounceTimer

  // if (checkGround()){
  //   clearInterval(ballTimer);
  //   game[game.SCORE_TAKER].score++;
  // };
}

Ball.prototype.updatePos = function(){
  $(this.idName).offset({
    top : this.position.y,
    left : this.position.x
  })
};

function checkGround(){
  return game.ball.position.y >= game.COURT_SIZE.height - game.ball.ballRadius? true : false;
}
function checkBoundary(){
  if (game.ball.position.x - game.COURT_LIMIT<=0 || game.ball.position.x >= game.COURT_SIZE.width + game.COURT_LIMIT){
    game.ball.velocity.x *= -1;
    return true;
  };
  if (game.ball.position.y <=0 || game.ball.position.y >= game.COURT_SIZE.height){
    game.ball.velocity.y *= -1;
    return true;
  };
}

function addPoint(){
  console.log(game.SCORE_TAKER);
  game.score[game.SCORE_TAKER]++;
  console.log(game.score);
  if (game.score[game.SCORE_TAKER] >= game.MAX_POINT){
    // END OF GAME -> RETURN SCORE
  }else{
    //MORE INITIALIZATION
    var nextSERVE = game.SCORE_TAKER;
    var nextGET = game.CURRENT_PLAYER;
    game.initialize();
    game.CURRENT_PLAYER = nextSERVE;
    game.SCORE_TAKER = nextGET;
    game.ball.initialize(game);
    console.log(game.CURRENT_PLAYER);
    setBounceTimer();

  Object.observe(game.ball.position, function(changes) {
    playerTurn(game.ball.position.x);
  });

  };
}

function playerTurn (ball_x){
  if (ball_x < (game.COURT_LIMIT + game.COURT_SIZE.width) / 2){
    game.CURRENT_PLAYER = "p1";
    game.SCORE_TAKER = "p2";
  } else {
    game.CURRENT_PLAYER = "p2";
    game.SCORE_TAKER = "p1";
  }
};
// Player [PROPERTIES] //
var Player = function(){
  this.position = { x: null, y: null };
  this.velocity = { x: null, y: null };
  this.init_pos = { x: null, y: null }; // init JUMP motion
  this.up = false; // JUMP
  this.hit = false; // JUMP
  this.g = 15; // sensitivity of JUMP
  this.t_p = 0; // JUMP
  this.dimension = { width: 120, height: 85};
  this.name = null;
  this.thresholdLevel = null;
  this.traj = {
    velocity: { x: 0, y: -100}
  },
  this.score = 0;
};

// Player [METHODS] //
Player.prototype.initialize = function(game, name,divOffset){
  this.name = name;
  if (this.name == "p1"){
    this.position.x = divOffset.left + 70;
    this.position.y = divOffset.top + game.COURT_SIZE.height - this.dimension.height - 50;
  }else if (this.name == "p2"){
    this.position.x = divOffset.left + game.COURT_SIZE.width - this.dimension.width - 70;
    this.position.y = divOffset.top + game.COURT_SIZE.height - this.dimension.height - 50;
  };
  this.thresholdLevel = divOffset.top + game.COURT_SIZE.height - this.dimension.height - 50;
  this.updatePos();
};

Player.prototype.unifyPlayer = function(){
  var tmp = $("#" + this.name);
  this.position.y = tmp.offset().top + this.dimension.height * 0.5;
  if (this.name == "p1"){
    this.position.x = tmp.offset().left + this.dimension.width * 0.8;
  }else if (this.name == "p2"){
    this.position.x = tmp.offset().left + this.dimension.width * 0.2;
  };
};

var curr;
function jumpEvent (curr_player){
  game[curr_player].t_p = 0;
  game[curr_player].init_pos.x = game[curr_player].position.x;
  game[curr_player].init_pos.y = game[curr_player].position.y;
  curr = curr_player;
  jumpUp = setInterval(everyJump, 10);
}

function everyJump (){
  console.log(game[curr]);
  game[curr].t_p += 0.25;
  game[curr].position.x = game[curr].init_pos.x + game[curr].traj.velocity.x * game[curr].t_p;
  game[curr].position.y = game[curr].init_pos.y + game[curr].traj.velocity.y * game[curr].t_p + 0.5 * game[curr].g * Math.pow(game[curr].t_p, 2);

  console.log(game[curr].position.y);
  console.log(game[curr].thresholdLevel);

  game[curr].updatePos();

  if (game[curr].position.y >= game[curr].thresholdLevel ){
    clearInterval(jumpUp);
    game[curr].t_p = 0;
    game[curr].up = false;
  }
}

Player.prototype.everyJump = function(){
  this.t_p += 0.25;
  this.position.x = this.init_pos.x + this.velocity.x * this.t_p;
  this.position.y = this.init_pos.y + this.velocity.y * this.t_p + 0.5 * this.g * Math.pow(this.t_p, 2);
  this.updatePos();

  if (this.position.y >= game.COURT_SIZE.height - 120){
    clearInterval(jumpUp);
    this.t_p = 0;
    this.up = false;
  }
};

Player.prototype.updatePos = function(){
  $("#" + this.name).offset({
    left: this.position.x,
    top: this.position.y
  });
};
