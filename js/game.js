var jumpUp, trajTimer, ballTimer, ballTimer2;
var timerList = [];
var init_traj = {x: null, y:null};

var Game = function(){
  this.MAX_POINT = 21;
  this.COURT_SIZE = { width: 800, height: 600};
  this.START = false;
  this.COURT_LIMIT = {x: null, y: null};
  this.CURRENT_PLAYER = null;
  this.SCORE_TAKER = null;
  this.NET_HEIGHT = 250;
  this.NET_WIDTH = 10;
  this.p1 = null;
  this.p2 = null;
  this.ball = null;
  this.score = {p1: 0, p2:0};
  this.thresholdLevel = null;
};

// Game METHODS
Game.prototype.initialize = function(){
  this.p1 = new Player();
  this.p2 = new Player();
  this.ball = new Ball();
  this.p1.initialize(this, "p1",$("#player1").offset());
  this.p2.initialize(this, "p2",$("#player1").offset());
  if (this.score.p1 == 0 && this.score.p2 == 0){
    this.CURRENT_PLAYER = "p1";
    this.SCORE_TAKER = "p2";
  };
  this.COURT_LIMIT = {
    x: $("#player1").offset().left,
    y: $("#player1").offset().top
  };
  this.ball.initialize(this);
  this.thresholdLevel = $("#threshold").offset().top - this.p1.dimension.height;
};

Game.prototype.reInit = function(){
  this.p1.initialize(this, "p1",$("#player1").offset());
  this.p2.initialize(this, "p2",$("#player1").offset());
}

// Generic functions associated with the game object
function hitRadius (allowableRadius) {
  var player = game.CURRENT_PLAYER;
  game[player].unifyPlayer();
  var playerPosition = game[player].position;
  var ballPosition = game.ball.unifyPosition();
  var radius = Math.sqrt(Math.pow(ballPosition.x - playerPosition.x,2) + Math.pow(ballPosition.y - playerPosition.y,2));
  if (radius <= allowableRadius){
    init_traj = {
      x: ballPosition.x - playerPosition.x,
      y: ballPosition.y - playerPosition.y
    };
    return init_traj // carrying the delta X and delta Y between ball and player
  }
}

function addPoint(){
  game.score[game.SCORE_TAKER]++;  // add point
  $("#" + game.SCORE_TAKER + "_score").html(game.score[game.SCORE_TAKER]);
  if (game.score[game.SCORE_TAKER] >= game.MAX_POINT){
    // END OF GAME -> RETURN SCORE
    clearInterval(ballTimer2);
    clearInterval(ballTimer);
    clearInterval(jumpUp);
    clearInterval(trajTimer);

    $("#gameOver").css({
      'z-index':1
    });
  }else{
    var nextSERVE = game.SCORE_TAKER;
    var nextGET = game.CURRENT_PLAYER;
    clearInterval(ballTimer2);
    clearInterval(ballTimer);
    clearInterval(jumpUp);
    clearInterval(trajTimer);
    $("#pika").css({opacity:0});
    game.reInit();
    game.CURRENT_PLAYER = nextSERVE;
    game.SCORE_TAKER = nextGET;
    game.ball.initialize(game);
    game.ball.velocity = { x: 0, y: -5};
    $("#pika").css({opacity:0});
    var countDown = 3;
    $("#countdown").html(countDown);
    var countdownTimer = setInterval(function(){
      countDown--;
      $("#countdown").html(countDown);
      if (countDown <= 0){
        setBounceTimer();
      $("#countdown").html("");
        clearInterval(countdownTimer);
      }},1000);
  };
}

function playerTurn (ball_x){
  if (ball_x < (game.COURT_LIMIT.x + game.COURT_SIZE.width) / 2){
    game.CURRENT_PLAYER = "p1";
    game.SCORE_TAKER = "p2";
  } else {
    game.CURRENT_PLAYER = "p2";
    game.SCORE_TAKER = "p1";
  }
};