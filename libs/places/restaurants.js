//fetch.js
var fetch = require("./fetch.js");
var get_place = fetch.get_place;

//places.js
var places = require("./places.js");
var food_q = places.Food;

var rest_q = food_q;
rest_q.position = {
  lat: 34.058583,
  long: -118.416582
};
rest_q.rad = 5000;
rest_q.cat = "coffee";
rest_q.rankBy = "prominence";

//get_place(rest_q);
