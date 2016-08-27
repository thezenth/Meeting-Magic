// preferences.js - grabs the list of food preferences from a .yaml file

yaml = require('js-yaml');
fs = require('fs');

console.log("SERVER:loading food preferences");
var allPrefs = yaml.safeLoad(fs.readFileSync(__dirname + '/preferences.yaml', 'utf8'));
//console.log(allPrefs);

//Structure of yaml.safeLoad return:

//[
//    {
//        thingone: and its stuff
//    },
//    {
//        etc.
//    }
//]

var Foods = allPrefs[0]['foods'];
if (Foods == null) {
	console.error("SERVER:couldn't load food preferences");
} else if (Foods.length > 0) {
	//console.log(`SERVER:loaded foods ${Foods}`);
} else if (Foods.length == 0) {
	console.error('SERVER:no food preferences found!');
}
//all of the possible food, etc. preferences
module.exports = {
	Foods: Foods
}
