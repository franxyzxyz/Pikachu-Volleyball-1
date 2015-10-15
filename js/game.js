var jumpUp, trajTimer, ballTimer, ballTimer2;
var timerList = [];

var Game = function(){
  this.MAX_POINT = 21;
  // this.SERVE = null; // randomize the start of first Server [ADD LATER] : prototype of Game
  this.COURT_SIZE = { width: 800, height: 600}; // width-height
  this.START = false;
  this.COURT_LIMIT = {x: null, y: null};
  this.CURRENT_PLAYER = null;
  // this.CURRENT_POINT = null;
  this.SCORE_TAKER = null;
  this.NET_HEIGHT = 250;
  this.NET_WIDTH = 10;
  this.p1 = null;
  this.p2 = null;
  this.ball = null;
  this.score = {p1: 0, p2:0};
  this.thresholdLevel = null;
  // this.onTimer = null; [setTimer generic function]
};

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
  // this.p1 = new Player();
  // this.p2 = new Player();
  // this.ball = new Ball();
  this.p1.initialize(this, "p1",$("#player1").offset());
  this.p2.initialize(this, "p2",$("#player1").offset());
}

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
    // console.log("THEY TOUCH!!");
    init_traj = {
      x: ballPosition.x - playerPosition.x,
      y: ballPosition.y - playerPosition.y
    };
    return init_traj// carrying the delta X and delta Y between ball and player {CAUTION: subsequent hitradius must be checked with undefined instead}
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
    // $("#restart").on("click",function(){
    //   document.location.reload(true);
    //   initiate();
    // });
    // alert("GAME OVER!");
    // if (confirm("Start Over?")){
    //   document.location.reload(true);
    //   initiate();
    // }
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
    //SET TIME OUT
    // countdown();
    //
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


// function countdown (){
//   if (game.score.p1 !== 0 || game.score.p2 !== 0 ){
//     var time = 3;
//     for (var i=time;i>=0;i--){
//       console.log(i);
//     };
//   }
// }

function playerTurn (ball_x){
  if (ball_x < (game.COURT_LIMIT.x + game.COURT_SIZE.width) / 2){
    game.CURRENT_PLAYER = "p1";
    game.SCORE_TAKER = "p2";
  } else {
    game.CURRENT_PLAYER = "p2";
    game.SCORE_TAKER = "p1";
  }
};