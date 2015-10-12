$(function(){
  var g = 10;
  var t = 0;
  var maxX = 800;
  var maxY = 600;
  var dt = 1;
  var newTimer;

  var position = {
    x_0 : 20,
    y_0 : 100,
    Vx : 110,
    Vy : -0,
    up : false,
    exc : false,

    x : 0,
    y : 0
  };

  update(position.x_0,position.y_0);

  function trajectory(){
    t+=0.25;
    position.x = position.x_0 + position.Vx * t;
    position.y = position.y_0 + position.Vy * t + 0.5 * g * t * t;
    $("#pika").offset({
      left:position.x,
      top:position.y
    });

    if (t>20){
      clearInterval(timer);
      t = 0;
      position.up=false;
    }

    // if (position.x<=0 || position.x >= maxX || position.y == 0 || position.y >= maxY){
    //   clearInterval(timer);
    //   t=0;
    //   setNewTimer(position);
    // };

  }

  function rules(object){
    if (object.x<=0 || object.x >= maxX){
      object.Vx = object.Vx * -1;
      console.log("X" + object.Vx);
    };
    if (object.y == 0 || object.y >= maxY){
      object.Vy = object.Vy * -1;

    };

    object.x = object.x + object.Vx * dt;
    object.y = object.y + object.Vy * dt;

    update(object.x,object.y);
  }

  function update(x,y){
    $("#pika").offset({
      top : y,
      left : x
    });
  }

  function setTimer(){
    timer = setInterval(trajectory, 10);
  }

  function setNewTimer(object){
    newTimer = setInterval(rules(object),10);
  }

  $(document).keydown(function(e){
    if (e.which == 38  && position.up == false){
      position.up = true;
      setTimer();
    };
    if (e.which == 13 && timer) { //return key
      position.exc = true;
      // clearInterval(timer);
      console.log($("#pika").offset().left,$("#pika").offset().top, position.x,position.y);

    }
  })

});