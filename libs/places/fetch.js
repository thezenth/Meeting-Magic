

// debug.js
var debug = require("../debug/debug.js");
dlog = debug.dlog;
def_opts = {
  id: "google-places-api",
  isWarning: false,
  isError: false
}

//latitude, longitude, rad, query, oauth, types="food", rankBy="prominence"
/* **opts**
opts: {
  types="food" (type of place)
  rankBy="empty, distance, or prominence",
}
*/
var goog_key = "AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ"
function build_url (latitude, longitude, rad, query, oauth, opts) {
    var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    var location = "location=" + latitude.toString() + "," + longitude.toString();
    var radius = "radius=" + rad.toString();
    var search = "keyword=" + query;
    var place_type = "types=" + opts.types;
    var authKey = "key=" + oauth

    var rank_by = ""

    switch(opts.rankBy) {
      case 'distance':
        radius = ""; //can't have radius when sorting by DISTANCE
        rank_by = "rankby=" + opts.rankBy;
        break;
      case 'prominence': //REMEMBER, PROMINENCE =/= RATING, BUT ALSO INCLUDES GOOGLE SEARCH RANK AND OTHER NEAT STUFF
        rank_by = "rankby=" + opts.rankBy
        break;
      default:
        rank_by = "";
        break;
    }

    var url = base + location + "&" + radius + "&" + search + "&" + place_type + "&" + rank_by + "&" + authKey;

    dlog("made google places fetch url", def_opts);
    //dlog("URL= " + url, def_opts)
    return (url);
    // EX: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.058583,-118.416582&radius=5000&keyword=coffee&rankby=prominence&types=food&key=AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ
}

/*build_url(
  34.058583,
  -118.416582,
  5000,
  "coffee",
  "goog_key",
  { types: "food", rankBy: "prominence" }
);*/
