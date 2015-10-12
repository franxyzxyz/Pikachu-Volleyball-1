$(function(){

var playerPos = {
  case1 : {left:1,top:1},
  case2 : {left:8,top:0},
  case3 : {left:10,top:12},
  case4 : {left:2,top:7}
};

var ballPos = {
  left: 5,
  top: 10
};

var u = 10;

var player = playerPos["case1"];

var V0 = {
  x: 0,
  y: 0
};


function V(player,ball){
  var x = player.left - ball.left;
  var y = player.top- ball.top;

  V0.x = u * x / Math.sqrt(x * x + y * y);
  V0.y = u * y / Math.sqrt(x * x + y * y);
};


V(player,ballPos);
});