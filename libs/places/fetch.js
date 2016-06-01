var request = require('request');

//places.js
var places = require("./places.js");
var food_q = places.Food;

// debug.js
var debug = require("../debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
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
function build_url (latitude, longitude, rad, types, query, rankBy, oauth) {
    var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
    var location = "location=" + latitude.toString() + "," + longitude.toString();
    var radius = "radius=" + rad.toString();
    var search = "keyword=" + query;
    var place_type = "types=" + types;
    var authKey = "key=" + oauth;

    var rank_by = ""

    switch(rankBy) {
      case 'distance':
        radius = ""; //can't have radius when sorting by DISTANCE
        rank_by = "rankby=" + rankBy;
        break;
      case 'prominence': //REMEMBER, PROMINENCE =/= RATING, BUT ALSO INCLUDES GOOGLE SEARCH RANK AND OTHER NEAT STUFF
        rank_by = "rankby=" + rankBy
        break;
      default:
        rank_by = "";
        break;
    }

    var newUrl = base + location + "&" + radius + "&" + search + "&" + place_type + "&" + rank_by + "&" + authKey;

    dlog("made google places fetch url", def_opts);
    //dlog("URL= " + newUrl, def_opts)
    return (newUrl);
    // EX: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.058583,-118.416582&radius=5000&keyword=coffee&rankby=prominence&types=food&key=AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ
}

/* **place_query**
place_query: {
  position: {
    lat: 0,
    long: 0
  },
  rad: 0,
  type: "type of place (e.g., food, entertainment)",
  cat: "category" (e.g., pizza, indian food, etc.),
  rankBy: "prominence" or "distance" or ""
}
*/

function get_place(place_query) {
  var url = build_url (
    place_query.position.lat,
    place_query.position.long,
    place_query.rad,
    place_query.type,
    place_query.cat,
    place_query.rankBy,
    goog_key
  );

  request(url, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      dlog("successfully fetched google places api", def_opts);
      //dlog("query=\n" + place_query.toString(), def_opts);
      //dlog("results:\n" + body);
      return (body);
    }
    else if (response.statusCode != 200) {
      dlog("status code: " + response.statusCode);
    }
    else {
      dlog(err, def_opts);
    }
  });

}

/*var rest_pq = food_q;
rest_pq.position = {
  lat: 34.058583,
  long: -118.416582
};
rest_pq.rad = 5000;
rest_pq.cat = "coffee";
rest_pq.rankBy = "prominence";

get_place(rest_pq);
*/

/*
build_url(
  34.058583,
  -118.416582,
  5000,
  "coffee",
  "goog_key",
  "food",
  "prominence"
);
*/
