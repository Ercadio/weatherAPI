const express = require('express');
const app = express();
const PORT = 3000;
const request = require('request');
const fs = require('fs');
const url = require('url');
app.set('port', PORT);
var mapStyle = '';
var OWM_API_KEY = '';
var GOOGLE_API_KEY = '';

// This defines the server and its operations
const server = app.listen(PORT, ()=>{                   // Listening on PORT
  style = getMapStyle();
  getOWMApiKey();
  getGoogleApiKey();
  console.log('The server succesfully started.');
});


function getMapStyle(){
  fs.readFile('mapstyle.js','utf8',function(error,data){
    if(error || data === ''){
      console.log('Warning: no map style was declared or found');
    }
    else{
      mapStyle = data;
    }
  });
}
function getOWMApiKey(){
  fs.readFile('keys.param','utf8',function(error,data){
    if(error){
      console.error('Something went wrong while trying to get the API keys');
    }
    else{
      if(data.split('\n').length < 1 || data.split('\n')[0] === '\r'){
        console.error('No API keys were found.');
      }
      OWM_API_KEY = data.split('\n')[0];
    }
  });
}
function getGoogleApiKey(){
  fs.readFile('keys.param','utf8',function(error,data){
    if(error){
    }
    else{
      if(data.split('\n').length < 2 || data.split('\n')[1] === '\r'){
        console.log('Warning: No Google API key were found.')
      }
      else{
        GOOGLE_API_KEY = data.split('\n')[1];
      }
    }
  });
}


// This handles any public file requested by the client
app.use(express.static('public'));

// This handles request made by clients to get the current weather when a location is provided
app.use('/weather', function(weatherRequest,weatherResponse){
  // This requests the data from the OWM API
  request('http://api.openweathermap.org/data/2.5/weather?lat=' + weatherRequest.query.lat + '&lon=' + weatherRequest.query.lon + '&appid=' + OWM_API_KEY,
  function(error,APIresponse,body){

    // This will log any errors from the API in 'error.log' and return an empty object
    if(error){
      console.error(error);
      fs.writeFile('./datafiles/error.log',error,(err)=>{
        if(err) console.error("Something went wrong while trying to write in the error.log file");
      });
      weatherResponse.send('');
    }

    // This will send the JSON data to the client
    else{
      weatherResponse.send(body);
    }
  });
});


// This handles request made by clients to get the current map when a location is provided
app.use('/map', function(mapRequest,mapResponse){
  // This requests the data from the GoogleMaps API
  if(GOOGLE_API_KEY != ''){
    request('https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY + '&callback=initMap',
    function(error,APIresponse,body){
      // This will log any errors from the API in 'error.log' and return an empty object
      if(error){
        console.error(error);
        fs.writeFile('./datafiles/error.log',error,(err)=>{
          if(err) console.error("Something went wrong while trying to write in the error.log file");
        });
        mapResponse.send('');
      }
      // This will send the javascript code from the Google API to the client
      else{
        // This will append the initMap() function to all the javascript code received by the Google map API.
        body += 'function initMap(){';
        if(mapStyle != ''){
              body += mapStyle;
        }
        body += 'var map = new google.maps.Map(document.getElementById(\'map\'),{'
              + '  center: {lat:' + mapRequest.query.lat + ', lng:' + mapRequest.query.lon + '},'
              + '  zoom: 15,'
              + '  mapTypeControlOptions: {'
              + '     mapTypeIds: [\'roadmap\', \'satellite\', \'hybrid\', \'terrain\','
              + '             \'styled_map\']'
              + '   }'
              + ' });'
              + ' map.mapTypes.set(\'styled_map\', styledMapType);'
              + ' map.setMapTypeId(\'styled_map\');'
              + '}';
      }
      mapResponse.send(body);
    });
  }
  else{
    mapResponse.send('');
  }
});




//
//
// // A simple algorithm to find all of the '{{__varname}}' instances in the html file and replace them by the data in weather
// function fixVariables(html,weather){
//   // This is the current index
//   var cursor = 0;
//
//   // This checks if an instance is found
//   while(html.indexOf("{{",cursor) != -1 && html.indexOf("}}",cursor) != -1){
//     var begin = html.indexOf("{{",cursor) + 2;  // This is the beggining of __varname
//     cursor = begin;                             // Updates cursor
//     var end = html.indexOf("}}",cursor);        // This is the end of __varname
//     var replacedVar = "";                       // This will hold the API value
//     try{
//       replacedVar = eval(html.substr(begin,end - begin));       // Tries to evaluate the variable
//     }
//     catch(e){
//       console.error('A variable was undeclared');
//       replacedVar = "undeclared";                                // If no variable found, sets value to undeclared
//     }
//     html = html.substr(0,begin - 2) + String(replacedVar) + html.substr(end + 2);         // Fixes the html response for that variable
//   }
//   return html;
// }
