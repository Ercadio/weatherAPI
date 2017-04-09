window.addEventListener('load',function (){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){

      // This is the request to get the weather from the server
      var weatherRequest = new XMLHttpRequest();
      weatherRequest.addEventListener('load',function(){
        loadWeather(this.responseText);
      });
      weatherRequest.open("GET", window.location.href + "weather/?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude);
      weatherRequest.send();


      // This is the request to get the map from the server
      var mapRequest = new XMLHttpRequest();
      mapRequest.addEventListener('load',function(){
        loadMap(this.responseText);
      });
      mapRequest.open("GET", window.location.href + "map/?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude);
      mapRequest.send();
    });
  }
});

function loadWeather(jsonData){
  var elm = document.getElementById('center-title');
  if(jsonData != ''){
    data = JSON.parse(jsonData)
    elm.innerHTML = data.name + ', ' + data.sys.country + '<br><br><img id=\'icon\' src=\'img/' + data.weather[0].icon + '.png\'><br><br>' + String((data.main.temp - 273.15).toFixed(0)) + ' &#176;C';
    resizeIcon();
    setAnimations();
  }
  else{
    elm.innerHTML = 'Something went wrong. We\'re sorry about that.'
  }
}

function loadMap(mapScriptText){
  if(mapScriptText != ''){
    var googleMapScript = document.createElement('script');
    googleMapScript.innerHTML = mapScriptText;
    googleMapScript.async = true;
    document.head.appendChild(googleMapScript);
  }
}
