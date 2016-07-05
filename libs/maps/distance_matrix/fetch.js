// debug.js
var debug = require("../../debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
	id: "google-maps/distance-matrix",
	isWarning: false,
	isError: false
}

var apiKey = "AIzaSyApb_nPuz3nPSO9lDBnGBbIF4Q98-JJJc8";

function build_url(org, dest, depart_time = 0, oauth = 0, u = 0) {
	var base = "https://maps.googleapis.com/maps/api/distancematrix/json?";

	var units = "";
	var origin = "";
	var destination = "";
	var departatureTime = "";
	var authKey = "";

	var newUrl = base;

	if(u) {
		units = "units=" + u; //imperial or metric
		newUrl += units;
	}

	origin = "origins=" + org.lat + "," + org.lng;
	newUrl += ("&" + origin);

	destination = "destinations=" + dest.lat + "," + dest.lng;
	newUrl += ("&" + destination);

	if(depart_time) {
		departatureTime = "depature_time=" + depart_time;
		newUrl += ("&" + departatureTime);
	}

	if(!oauth) {
		oauth = apiKey;
	}

	authKey = "key=" + oauth;
	newUrl += ("&" + authKey);

	dlog("made google maps distance matrix fetch url", def_opts);
	//dlog("URL= " + newUrl, def_opts)
	return (newUrl);
	// EX: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.058583,-118.416582&radius=5000&keyword=coffee&rankby=prominence&types=food&key=AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ
}
dlog(build_url({lat: 40.6655101, lng: -73.89188969999998}, {lat: 40.6905615, lng: -73.9976592}, false, apiKey, "imperial"), def_opts);

//function get_shortest_paths(org, dest)
