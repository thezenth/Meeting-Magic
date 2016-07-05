// debug.js
var debug = require("../../debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
	id: "google-maps/distance-matrix",
	isWarning: false,
	isError: false
}

var apiKey = "AIzaSyApb_nPuz3nPSO9lDBnGBbIF4Q98-JJJc8";

function build_url(org, dest, oauth, u = 0) {
	var base = "https://maps.googleapis.com/maps/api/distancematrix/json?";

	var units = "";
	var origin = "";
	var destination = "";

	if(u) {
		var units = "units=" + u; //imperial or metric
	}
	var origin = "origins=" + org.lat + "," + org.lng;
    var destination = "destinations=" + dest.lat + "," + dest.lng;

	var authKey = "key=" + oauth;

	var newUrl = base + units + "&" + origin + "&" + destination + "&" + authKey;

	dlog("made google maps distance matrix fetch url", def_opts);
	//dlog("URL= " + newUrl, def_opts)
	return (newUrl);
	// EX: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=34.058583,-118.416582&radius=5000&keyword=coffee&rankby=prominence&types=food&key=AIzaSyDpHahG-VLpYYZo238mbnHdFfLqLf91rSQ
}

//function get_shortest_paths()
dlog(build_url({lat: 40.6655101, lng: -73.89188969999998}, {lat: 40.6905615, lng: -73.9976592}, apiKey, "imperial"), def_opts);
