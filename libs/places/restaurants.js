var async = require('async');
var fs = require('fs');

//fetch.js
var fetch = require("./fetch.js");
var get_place = fetch.get_place;
var build_img_url = fetch.build_img_url;

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
 * @param {Object} data - The data returned from a Google Places API query.
 */
function fetch_parse(data) {
	var restList = [];
	//data = get_place(query);
	for (var i = 0; i < data['results'].length; i++) {
		curr_rest = data['results'][i];
		ident = "Not available"
		name = "Not available"
		address = "Not available"
		rest_latitude = 0.0
		rest_longitude = 0.0
		rating = "Not available"
		hours = []

		if ('place_id' in curr_rest) {
			ident = curr_rest['place_id'];
		}
		if ('name' in curr_rest) {
			name = curr_rest['name'];
		}
		if ('vicinity' in curr_rest) {
			address = curr_rest['vicinity'];
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
		}
		if ('rating' in curr_rest) {
			rating = curr_rest['rating'];
		}

		if ('opening_hours' in curr_rest) {
			if ('weekday_text' in curr_rest['opening_hours']) {
				if ((curr_rest['opening_hours']['weekday_text']).length > 0) {
					hours = curr_rest['opening_hours']['weekday_text'];
				}
			}
		}

		var photo_reference = "";
		var max_width = "";
		if ('photos' in curr_rest) {
			if ('photo_reference' in curr_rest['photos'][0]) {
				photo_reference = curr_rest['photos'][0]['photo_reference'];
			}
			if ('width' in curr_rest['photos'][0]) {
				max_width = curr_rest['photos'][0]['width'];
			}
		}

		// creating a JSON object to temporarily put in data.json
		newRest = {};
		newRest.type = 'food';
		newRest.name = name;
		newRest.address = address;
		newRest.position = {
			lat: rest_latitude,
			long: rest_longitude
		}
		newRest.hours = hours;
		newRest.rating = rating;
		newRest.ref = ident;
		if(photo_reference !== "") {
			newRest.imgUrl = build_img_url(photo_reference, max_width);
		}

		objStr = JSON.stringify(newRest, null, 4)

		restList.push(newRest);
	}
	//write restaurants to data.json
	//have to read and write from the relative path of the original server.js for some reason..?
	console.log("SERVER:attempting to write parsed restaurant objects to ./libs/places/data.json");
	fs.readFile('./libs/places/data.json', function (err, jsonData) {
		if(err) {
			console.error(`GOOGLE PLACES API:${err}`);
		}
		else {
			var parsedJson = JSON.parse(jsonData);

			parsedJson["found_places"] = [];
			fs.writeFile('./libs/places/data.json', JSON.stringify(parsedJson, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs

			//edit the dictionary-JSON structure to reflect found places
			parsedJson['found_places'] = restList;
			//write the edited structure in its entirity to the data.json file
			fs.writeFile('./libs/places/data.json', JSON.stringify(parsedJson, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs

		}
	});
}

exports.fetch_parse = fetch_parse;
