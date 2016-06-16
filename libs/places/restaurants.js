var async = require('async');
var fs = require('fs');

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
	var restList = [];
	//data = get_place(query);
	//dlog(data, def_opts);
	for (var i = 0; i < data['results'].length; i++) {
		//dlog(item[i], def_opts);
		curr_rest = data['results'][i];
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

		newRest = {};
		newRest.type = 'food';
		newRest.name = name;
		newRest.address = address;
		newRest.position = {
			lat: rest_latitude,
			long: rest_longitude
		}
		newRest.hours = hours;
		objStr = JSON.stringify(newRest, null, 4)

		//dlog(objStr, def_opts);
		restList.push(newRest);
	}
	//write restaurants to data.json
	//have to read and write from the relative path of the original server.js for some reason..?
	dlog("attempting to write parsed restaurant objects to ./libs/places/data.json", def_opts);
	fs.readFile('./libs/places/data.json', function (err, jsonData) {
		if(err) {
			dlog(err, {id: "google-places-api", isError:true, isWarning:false});
		}
		else {
			dlog("successfully read ./libs/places/data.json", def_opts);
			var parsedJson = JSON.parse(jsonData);

			dlog("wiping data.json found_places", def_opts);
			parsedJson["found_places"] = [];
			fs.writeFile('./libs/places/data.json', JSON.stringify(parsedJson, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs
			dlog("parsedJson @ restaurants.js:"+JSON.stringify(parsedJson, null, '\t'), def_opts);

			//edit the dictionary-JSON structure to reflect found places
			parsedJson['found_places'] = restList;
			//write the edited structure in its entirity to the data.json file
			fs.writeFile('./libs/places/data.json', JSON.stringify(parsedJson, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs
			dlog("successfully wrote ./libs/places/data.json", def_opts);
			dlog("parsedJson @ restaurants.js:"+JSON.stringify(parsedJson, null, '\t'), def_opts);

		}
	});
	//console.log(restList);
}

exports.fetch_parse = fetch_parse;
