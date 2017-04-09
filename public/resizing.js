window.addEventListener('load',function(){
  document.body.style['font-size'] = 0.04 * Math.min(window.innerWidth,window.innerHeight) + 'px';
});
window.addEventListener('resize',function(){
  document.body.style['font-size'] = 0.04 * Math.min(window.innerWidth,window.innerHeight) + 'px';
  if(document.getElementById('icon') != null){
    document.getElementById('icon').width = 0.2 * Math.min(window.innerWidth,window.innerHeight);
  }
});
function resizeIcon(){
  document.getElementById('icon').width = 0.2 * Math.min(window.innerWidth,window.innerHeight);
}
