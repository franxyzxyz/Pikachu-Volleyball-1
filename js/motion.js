var timer;

var Motion = function(){
  this.intial_Vx= 5;
  this.initial_Vy= 20;
  this.g = 10;
  this.t = 0;

  this.x = 0;
  this.y = 0;
  this.Vx = 0;
  this.Vy = 0;
  this.initial_x = 0;
  this.initial_y=0;
};

var initPos = $("#pika").offset();

Motion.prototype.initialize = function(init){
  this.initial_x = init.left;
  this.y = init.top;
};


var motion = new Motion();

motion.initialize(initPos);


var timeIncrement = function(){
  var str = "";
  if (motion.t >= 10){
    clearInterval(timer);
  }else{
    motion.t++;
    motion.Vx = motion.intial_Vx * motion.t;
    motion.Vy = motion.initial_Vy - motion.g * motion.t;
    motion.x = motion.Vx * motion.t;
    motion.y = motion.initial_Vy * motion.t - motion.g * motion.t * motion.t / 2;

    str = "t=" + motion.t;
    str += " Vx: " + motion.Vx;
    str += " Vy: " + motion.Vy;
    str += " x: " + motion.x;
    str += " y: " + motion.y;
    console.log(str);

    $("#pika").offset({
      top: motion.y * -1,
      left: motion.x
    })

  }
}

function setTimer(){
  timer = setInterval(timeIncrement,100);
}

setTimer();