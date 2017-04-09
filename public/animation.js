const FPS = 30;
function setAnimations(){
  var icon = document.getElementById('icon');
  icon.addEventListener('onmouseover',function(event){
    startAnimation(function(time){
      var angle = time * 360 / 1000;
      icon.style['-ms-transform'] = 'rotate('+ angle  + 'deg)';
      icon.style['-webkit-transform'] = 'rotate(' + angle + 'deg)';
      icon.style['transform'] = 'rotate(' + angle + 'deg)';
    },1000,function(call){
      icon.addEventListener('onmouseout',call);
    });
  });
}


function startAnimation(animate,totalTime,stopEvent){
  var startTime = new Date();
  startTime = startTime.getTime();
  var runningAnimation = setInterval(function(){
    var time = new Date;
    time = time.getTime();
    if(time - startTime <= totalTime){
      animate(time - startTime);
    }
    else{
      clearInterval(runningAnimation);
    }
  },1000/FPS);
  stopEvent(function(){
    if(runningAnimation){
      clearInterval(runningAnimation);
    }
  });
}
