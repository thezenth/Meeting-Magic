var qs = require('qs');

//preferences.js
prefs = require('../config/preferences');
Foods = prefs.Foods;

var User = require('../models/user');
var Meeting = require('../models/meeting');

//fetch and google places stuff
var fetch = require('../libs/places/fetch');
var get_place = fetch.get_place;

var restaurants = require('../libs/places/restaurants');
var fetch_parse = restaurants.fetch_parse;

var places = require('../libs/places/places');
var food_q = places.Food;

//compare_prefs.js
var comp = require('../libs/compare_prefs');
var compare_food_prefs = comp.compareFood;

//async
var async = require('async');

//url module
var url = require('url');

var express = require('express');
var router = express.Router();

module.exports = function(sio, passport) {

    //user-prefs
    router.get('/',function (req, res) {
        res.render('user-prefs', {
            userPrefs: { foodprefs: req.user.food_prefs },
            foods: Foods
        });
    });

    //HEY! Here is what the session data for a user looks like so far:
    /*
    { local:
    { email: 'noahw1',
     password: '$2a$08$lr/eFXaNfZqEwF5ld0u5x.iXvdbKL3hzklJcIMAh7rwTPfeTzxPFq' },
    food_prefs: [],
    __v: 0,
    _id: 575843c2bf7bd32028c5decd }
    */
    router.post('/', function (req, res) {
        process.nextTick(function () {
            console.log(`CLIENT:user email is ${req.user.local.email}`);
            User.findOne({
                'local.email': req.user.local.email
            }, function (err, user) {
                console.log(`SERVER:got foodprefs- ${req.body.foodprefs}`);
                user.food_prefs = req.body.foodprefs;
                user.save();
                console.log("SERVER:successfully updated user");
                res.redirect('/home');
            });
        });
    });

    return router;
}
