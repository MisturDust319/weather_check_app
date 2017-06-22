//project vision
//either input an area code
//  OR a city, State
//and get local temp

const find_temperature = require('./find_temperature.js');


if( process.argv.length === 3)
  find_temperature.getTemp({ zip : process.argv[2] });
else if (process.argv.length === 4)
  find_temperature.getTemp({ city : process.argv[2], state : process.argv[3]});
else
  console.log("I'm sorry, please input either a Zip Code, or a city and a state (in that order)");
