//fetch.js
var fetch = require("./fetch.js");
var get_place = fetch.get_place;

//places.js
var places = require("./places.js");
var food_q = places.Food;

/**
* Designed to fetch data on a restaurant from the Google Places API in JSON format, using the get_place function from fetch.js and Food query template.
* @method fetch_parse
* @param {Object} pos A position object.
* @param {Number} rad The radius of the defined search area circle.
* @param {String} cat The category of restaurant you are looking for; ex. coffee, pizza, donuts, indian, etc.
* @param {String} rankBy For the Google Places API, either "distance" (which then ignores radius, and ranks by distance from provided position), or "prominence" (which takes into account rating, mentions on google, etc.)
*/
function fetch_parse(pos, rad, cat, rankBy) {
  var rest_q = food_q;
  rest_q.position = pos;
  rest_q.rad = rad;
  rest_q.cat = cat;
  rest_q.rankBy = rankBy;

  rest = get_place(rest_q);

}
//get_place(rest_q);
