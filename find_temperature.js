//project vision
//either input an area code
//  OR a city, State
//and get local temp

//import http(s) module
const http = require('http');

//import settings
const settings = require('./settings');
const find_coordinates = require('./find_coordinates');

function find_temperature( location ) {
  try {
    //function to handle getting the proper URL
    function getURL( location ) {
      
      //holds url till needed
      let url = "";
    
      if( location.zip !== undefined ) {
        console.log("using ZIP CODE");
        getTemp(location.zip);
      }
      else {
            //otherwise, assume you will use city, state
            console.log("using CITY, STATE");
            find_coordinates.getLocation(location, getTemp);
      }
      
      return url;
    }
    
        
    function getTemp( zip ) { 
      //get the url with the zip code provided
      const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&APPID=${settings.keys.openWeatherMap}`;

      const request = http.get(url, response => {
        //body holds the data stream as it builds up
        let body = "";
        
        //read data
        response.on('data', data => {
          body += data.toString();
        });
        
        //when all data is read...
        response.on('end', () => {
                    try {
                      //parse the data into an obj
                      const data = JSON.parse(body);
                      
                      if( data.main === null || data.main === undefined ) {
                        //if data.main doesn't exist, assume the city data can't be found
                        console.log("I'm sorry, I can't find any data for that place.\nIs there a nearby major city I can search instead?");
                      }                    
                      else {
                        //this is the data to log
                        var temperature = data.main.temp;
                        var city = data.name;
                        var message = `The current temperature in ${city} is ${temperature}`;
                        //log the info
                        console.log(message);
                      }
                    } catch(error) {
                      console.error("Error in parsing data: " + error.message);
                    }    
        });
      });
      request.on('error', error => {
        console.error(`Error on HTTP Request: ${error.message}`);
      });
    }

    //run the function proper
    getURL(location);
  } catch (error) {
    console.error(`Error making HTTP Request.\nMessage: ${error.message}`);
  }
}

//export data
exports.getTemp = find_temperature;
