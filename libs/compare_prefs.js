// debug.js
var debug = require("./debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
	id: "google-places-api",
	isWarning: false,
	isError: false
}

function compareFood(l1, l2) {

    var prefs1; //longer list
    var prefs2; //shorter list

    var sameList = [];

    //determine which list is longer and assign accordingly
    if(l1.length > l2.length) {
        prefs1 = l1;
        prefs2 = l2;
    }
    else {
        prefs1 = l2;
        prefs2 = l1;
    }

    for(a = 0; a<prefs1.length; a++) {
        for(b = 0; b<prefs2.length; b++) {
            if(prefs1[a] == prefs2[b]) {
                sameList.push(prefs1[a]);
            }
        }
    }

    dlog("same list:"+sameList, def_opts);
    return sameList;
}

module.exports = {
    compareFood: compareFood
};
