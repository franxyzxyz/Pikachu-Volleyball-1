window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var g = 10;
var t = 0;
var position = {
  x_0 : 0,
  y_0 : 20,
  Vx : 15,
  Vy : -20,

  x : 0,
  y : 0
};
var elem = $("#pika");
var startTime = undefined;
var time = 0;

function trajectory(t){
  if (t===undefined){
    t = Date.now();
  };
  if (startTime === undefined){
    startTime = t;
  }

  time = t - startTime;

  position.x = position.x_0 + position.Vx * time;
  position.y = position.y_0 + position.Vy * time + 0.5 * g * time * time;

  $("#pika").offset({
    left:position.x,
    top:position.y
  });

};

function animloop(){
  trajectory();
  requestAnimFrame(animloop,elem);
}

// animloop();
