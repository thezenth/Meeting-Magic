// ***For now, this is a list of basic query structures***

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

//Restaurants/other food things
var Food = Basic;
Food.type = "food";

module.exports = {
  Food: Food
}
