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
  };
  this.score = 0;
  this.touch = 0;
};

// Player [METHODS] //
Player.prototype.initialize = function(game, name,divOffset){
  this.name = name;
  this.thresholdLevel = $("#threshold").offset().top - 50 - (this.dimension.height * 0.7);
  if (this.name == "p1"){
    this.position.x = divOffset.left + 80;
    this.position.y = this.thresholdLevel - 5;
  }else if (this.name == "p2"){
    this.position.x = divOffset.left + game.COURT_SIZE.width - this.dimension.width - 80;
    this.position.y = this.thresholdLevel - 5 ;
  };
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
  curr = curr_player;
  game[curr_player].init_pos.x = game[curr_player].position.x;
  game[curr_player].init_pos.y = game[curr_player].position.y;
  timerList.push("jumpUp");
  jumpUp = setInterval(everyJump, 10);
}
var tmpArray = {
  p1: {
    prev: {x: null, y:null},
    curr: {x: null, y:null}
  },
  p2: {
    prev: {x: null, y:null},
    curr: {x: null, y:null}
  }
}
function everyJump (){
  if (game[curr].t_p !== 0){
    tmpArray[curr].prev.x = tmpArray[curr].curr.x;
    tmpArray[curr].prev.y = tmpArray[curr].curr.y;
    var tmpvalue = $("#" + curr).offset().top - game[curr].dimension.height;
    if (tmpArray[curr].prev.y >= game.thresholdLevel + 5){
        game[curr].t_p = 0;
        game[curr].up = false;
        game[curr].position.y = game.thresholdLevel - 5;
        removeTimer(jumpUp);
        clearInterval(jumpUp);
        game[curr].t_p -=0.25;
        game[curr].up = false;
    }
  }
  game[curr].t_p += 0.25;

  game[curr].position.x = game[curr].init_pos.x + game[curr].traj.velocity.x * game[curr].t_p;
  tmpArray[curr].curr.x = game[curr].position.x;
  game[curr].position.y = game[curr].init_pos.y + game[curr].traj.velocity.y * game[curr].t_p + 0.5 * game[curr].g * Math.pow(game[curr].t_p, 2);
  tmpArray[curr].curr.y = game[curr].position.y;
  game[curr].updatePos();
}

Player.prototype.updatePos = function(){
  $("#" + this.name).offset({
    left: this.position.x,
    top: this.position.y
  });
};
