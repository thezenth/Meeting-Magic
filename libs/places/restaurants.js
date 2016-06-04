var async = require('async');

//fetch.js
var fetch = require("./fetch.js");
var get_place = fetch.get_place;

//places.js
var places = require("./places.js");
var food_q = places.Food;
var rest = places.Restaurant;

// debug.js
var debug = require("../debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
  id: "google-places-api",
  isWarning: false,
  isError: false
}

var rest_pq = food_q;
rest_pq.position = {
  lat: 34.058583,
  long: -118.416582
};
rest_pq.rad = 5000;
rest_pq.cat = "coffee";
rest_pq.rankBy = "prominence";

/**
* Designed to fetch data on a restaurant from the Google Places API in JSON format, using the get_place function from fetch.js and Food query template.
*
* @method fetch_parse
* @param {Object} pos A position object.
* @param {Number} rad The radius of the defined search area circle.
* @param {String} cat The category of restaurant you are looking for; ex. coffee, pizza, donuts, indian, etc.
* @param {String} rankBy For the Google Places API, either "distance" (which then ignores radius, and ranks by distance from provided position), or "prominence" (which takes into account rating, mentions on google, etc.)
*/

function fetch_parse(data) {
  //results = get_place(query);
  //dlog(data, def_opts);
  //dlog(data.length, def_opts);

  dlog("parsing JSON data", def_opts);
  var restList = [];
  async.each(data, function (item, callback) {
    for(var i=0;i<item.length;i++) {
      if(typeof item[i] == 'object') {
        //dlog(item[i], def_opts);
        curr_rest = item[i]
        ident = "Not available"
        name = "Not available"
        address = "Not available"
        rest_latitude = 0.0
        rest_longitude = 0.0
        rating = "Not available"
        hours = []

        if ('id' in curr_rest) {
            ident = curr_rest['id'];
            //dlog(ident, def_opts);
        }
        if ('name' in curr_rest) {
            name = curr_rest['name'];
            //dlog(name, def_opts);
        }
        if ('vicinity' in curr_rest) {
            address = curr_rest['vicinity'];
            //dlog(address, def_opts);
        }
        if ('geometry' in curr_rest) {
            if ('location' in curr_rest['geometry']) {
                if ('lat' in curr_rest['geometry']['location']) {
                    rest_latitude = curr_rest['geometry']['location']['lat'];
                }
                if ('lng' in curr_rest['geometry']['location']) {
                    rest_longitude = curr_rest['geometry']['location']['lng'];
                }
            }
            //dlog(rest_latitude + "," + rest_longitude, def_opts);
        }
        if ('rating' in curr_rest) {
            rating = curr_rest['rating'];
            //dlog(rating, def_opts);
        }

        if ('opening_hours' in curr_rest) {
            if ('weekday_text' in curr_rest['opening_hours']) {
                if ((curr_rest['opening_hours']['weekday_text']).length > 0) {
                    hours = curr_rest['opening_hours']['weekday_text'];
                }
            }
        }

        newRest = rest;
        newRest.position = {
          lat: rest_latitude,
          long: rest_longitude
        }
        newRest.name = name;
        newRest.address = address;
        newRest.hours = hours;
        //dlog(newRest, def_opts);

        if(restList.indexOf(newRest) == -1) {
          console.log("HELLO");
          restList.push(newRest);
        }
        //dlog(restList, def_opts);
        //dlog(restList, def_opts);
        //newRest = Restaurant(ident, name, address, rest_latitude, rest_longitude, hours, rating)
        //nameAndAddress = newRest.name + " " + newRest.address
        //if nameAndAddress not in restList:
        //    restList.append(nameAndAddress) # Bit of a hack for now, will have to fix it somehow

        //return (restList[:5]) # Returns the top 5 rated restaurants --> Since the fetch is already done in terms of rating, this returns the top 5 restaurants form the search
      }
    }
    callback(null);
  },
  function(err) {
    console.log(restList);
  });
}
get_place(rest_pq, fetch_parse);
