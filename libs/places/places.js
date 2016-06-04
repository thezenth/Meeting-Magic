// ***For now, this is a list of basic query and object structures***

var BasicPlace = {
  position: {
    lat: 0,
    long: 0
  },
  name: "",
  address: "",
  hours: [],
  type: ""
}

var Restaurant = BasicPlace;
Restaurant.type = "food";

//GET Request queries to Google Places API
//Reference model
var Basic = {
  position: {
    lat: 0,
    long: 0
  },
  rad: 0,
  type: "",
  cat: "",
  rankBy: ""
};

//Restaurants/other food queries
var Food = Basic;
Food.type = "food";

module.exports = {
  Food: Food,
  Restaurant: Restaurant
}
