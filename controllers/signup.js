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

    router.get('/', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    //process the signup form
    router.post('/', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure home section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    return router;
}
