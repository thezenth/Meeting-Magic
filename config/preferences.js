yaml = require('js-yaml');
fs   = require('fs');

// debug.js
var debug = require("../libs/debug/debug.js");
dlog = debug.dlog;
def_opts = {
  id: "server",
  isWarning: false,
  isError: false
}

dlog("loading all possible prefs...", def_opts);
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
    dlog("food preferences is undefined!!", {id:"server", isWarning:false, isError:true});
}
else if (Foods.length > 0) {
    dlog("loaded foods: " + Foods, def_opts);
}
else if(Foods.length == 0) {
    dlog("no possible food preferences found!", {id:"server", isWarning: true, isError:false});
}
//all of the possible food, etc. preferences
module.exports = {
    Foods: Foods
}
