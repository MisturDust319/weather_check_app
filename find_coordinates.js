const https = require('https');
const settings = require('./settings');

function getLocation(location, callback) {
  //open weather map doesn't support city/state stuff. so use a google maps api to get the zip code of that location
  const city = location.city.replace(/\s/g, '+');
  const state = location.state.replace(/\s/g, '+');
  
  try {
    const request = https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city},${state}&key=${settings.keys.googleMapsGeocoding}`,
                            response => {
                              let body = "";
                              //var to hold stream data
                              
                              //gather data
                              response.on('data', data => {
                                body += data.toString();
                                //console.log('receiving data :' + data);
                              });
                              
                              
                              
                              //parse data
                              response.on('end', () => {
                                          //get zip from api
                                          try {
                                            console.log("Sometimes a CITY, STATE combination is too vague to find the right place.\nTry using a zip code if your results are poor.");
                                            JSON.parse(body).results[0].address_components.forEach(function(component) {
                                              if( component.types[0] === "postal_code")
                                                callback(component.long_name);
                              });                                                                                       
                                          } catch (error) {
                                            console.error(`Error finding zip of city: ${error.message}`);
                                          }
  });
                            });
    request.on('error', error => {
      console.error(`Error parsing city data: ${error.message}`);
    });
  } catch (error) {
    console.error(`Error generating request for city data: ${error.message}`);
  }
}

//export data
exports.getLocation = getLocation;
