var Game = function(){
  this.basic={
    force:10,
    turn:"p1",
    canvasSize: {
      width:800,
      height:600
    },
    limit:null,
    increment:30
  };

  this.ball = {
    x: null,
    y: null,

    Vx: null,
    Vy: null,

    x_0 : 20,
    y_0 : 500,
    up : false,
    exc : false,

    x : 0,
    y : 0

  }

  this.p1 = {
    position: {
      x:null,
      y:null
    },
    control: {
      up: 87,
      left:65,
      down:83,
      right:68,
      hit:32
    }
  };

  this.p2 = {
    position: {
      x:null,
      y:null
    },
    control: {
      up: 38,
      left:37,
      down:39,
      right:40,
      hit:13
    }
  }

};

Game.prototype.initialize = function(p1Pos){
  var defaultY = p1Pos.top + this.basic.canvasSize.height - 120;
  var defaultX = p1Pos.left;

  this.basic.limit = this.basic.canvasSize.width/2;

  this.p1.position.x = defaultX;
  this.p1.position.y = defaultY;

  this.p2.position.x = defaultX + this.basic.limit;
  this.p2.position.y = defaultY;

};