var request = require('request');
var rp = require('request-promise');

var async = require('async');

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
// **opts**
//opts: {
//  types="food" (type of place)
//  rankBy="empty, distance, or prominence",
//}

var goog_key = "AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ"

/**
 * Builds a URL according to the Google Places API.
 *
 * @method build_url
 * @param {Number} latitude The latitude coordinate of the center of the search area.
 * @param {Number} longitude The longitude coordinate of the center of the search area.
 * @param {Number} rad The radius of the search area.
 * @param {String} type The type of place you will be looking for; ex: food, crusie, entertainment, etc.
 * @param {String} keywords The keywords of the search itself; ex: coffee, Indian, Pizza, etc.
 * @param {String} rankBy Rank the data either by "distance" from center of "prominence" (which includes rating, mentions on google, etc.). Specifies the order in which the data will be returned.
 * @param {String} oauth The authKey, provided by the Google Places API.
 * @return {String} newUrl The new URL.
 */
function build_url(latitude, longitude, rad, type, keywords, rankBy, oauth) {
	var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
	var location = "location=" + latitude.toString() + "," + longitude.toString();
	var radius = "radius=" + rad.toString();

	var search = "keyword=";
	for(i = 0; i<keywords.length; i++) {
		search += "(" + keywords[i] + ")";
		if(i<keywords.length - 1) { //if its not last
			search += " OR ";
		}
	}

	var place_type = "types=" + type;
	var authKey = "key=" + oauth;

	var rank_by = ""

	switch (rankBy) {
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

function build_img_url(ref, m_width) {
	//https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY

	if(ref == "") {
		dlog("returned no image url", {id:"google-places-api", isWarning:true, isError:false});
		return "";
	}
	else {
		var base = "https://maps.googleapis.com/maps/api/place/photo?";
		var maxWidth = "maxwidth=" + m_width;
		var imgRef = "photoreference=" + ref;
		var authKey = "key=" + goog_key;

		var newUrl = base + maxWidth + "&" + imgRef + "&" + authKey;

		//dlog("made google places image fetch url", def_opts);
		//dlog("image url:"+newUrl, def_opts);
		//newUrl = "http://www.hvantagetechnologies.com/img/industries/restaurant.jpg";
		return (newUrl);
	}
}

// place_query
//place_query: {
//  position: {
//    lat: 0,
//    long: 0
//  },
//  rad: 0,
//  type: "type of place (e.g., food, entertainment)",
//  cat: "category" (e.g., pizza, indian food, etc.),
//  rankBy: "prominence" or "distance" or ""
//}

/**
 * Designed to fetch data, specifically using the Google Places API (as it uses build_url, which builds a URL specifically for the Google Places API). Does not parse data, only gets it.
 *
 * @method get_place
 * @param {Object} place_query An object with all of the information needed to build the fetch URL. Specification: place_query: { position: { lat: Number, long: Number }, rad(radius of search): Number, type(see type in build_url): String, cat(see keywords in build_url): String, rankBy(see rankBy in build_url): String }
 * @return {String} body The JSON returned from the GET request. This is only returned if there are no errors.
 */

function donothing() {
	console.log("IMA CALLBACK");
}

function get_place(q, parseFunc) {
	var url = build_url(
		q.position.lat,
		q.position.long,
		q.rad,
		q.type,
		q.cat,
		q.rankBy,
		goog_key
	);
	dlog(url, def_opts);

	var options = {
		uri: url,
		json: true
	};

	rp(options)
		.then(function (data) {
			parseFunc(data);
		})
		.catch(function (err) {
			dlog("CAUGHT ERROR IN FETCH:" + err, {id: "google-places-api", isError: true, isWarning: false});
		});
}

/*function get_place(q, parseFunc) {


  async.map(lookup_list, function (item, callback) {
      request(url, function (err, response, body) {
        if (!err && response.statusCode == 200) {
          //dlog("successfully fetched google places api", def_opts);
          //dlog("query=\n" + place_query.toString(), def_opts);
          //dlog("results:\n" + body);
          callback(null, JSON.parse(body));
        }
        else if (response.statusCode != 200) {
          callback(response.statusCode, null);
        }
        else {
          callback(err, null);
        }
      });
    },
    function (err, results) {
      if (!err) {
        for (var i = 0; i < results.length; i++) {
          dlog(i, def_opts);
          //console.log(i);
          //console.log(results[i], def_opts);
          parseFunc(results[i]['results']);
        }
      }
      else {
        dlog(err, def_opts);
        //console.log("We had an error somewhere.");
      }
    });
}
*/

exports.get_place = get_place;
exports.build_img_url = build_img_url;

/*function secondFunction(data) {
  //console.log(data);
  for(var i =0; i<data.length; i++) {
    console.log(data[i]);
  }
}

function testy(err, result) {
  return err;
  return result;
}

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

  var funcy = function() {
    request(url, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        //dlog("successfully fetched google places api", def_opts);
        //dlog("query=\n" + place_query.toString(), def_opts);
        //dlog("results:\n" + body);
        testy(null, JSON.parse(body));
      }
      else if (response.statusCode != 200) {
        dlog("status code: " + response.statusCode);
      }
      else {
        dlog(err, def_opts);
      }
    });
  }

  async.parallel([
    function(testy){
      setTimeout(funcy, 200);
    }
  ],
  function(err, results){
      console.log(results[0])
  });




  //call_thing();

}
*/
//exports.get_place = get_place;

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
