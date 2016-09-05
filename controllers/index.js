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

    // other routes
    router.use('/login', require('./login')(sio, passport));
    router.use('/logout', require('./logout')(sio, passport));
    router.use('/home', require('./home')(sio, passport));
    router.use('/profile', require('./profile')(sio, passport));
    router.use('/user-prefs', require('./user-prefs')(sio, passport));
    router.use('/meeting', require('./meeting')(sio, passport));
    router.use('/results', require('./results')(sio, passport));
    router.use('/create', require('./create')(sio, passport));
    router.use('/signup', require('./signup')(sio, passport));

    //Home page (with login links)
	router.get('/', function (req, res) {
		res.render('index');
	});

    return router;
}
