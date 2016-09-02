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
        res.render('profile', {
            user: req.user
        });
    });

    router.post('/', function (req, res) {
        process.nextTick(function () {
            console.log(`CLIENT:user email is ${req.user.local.email}`);
            console.log(`CLIENT:new email is ${req.user.newemail}`);
            User.findOne({
                'local.email': req.user.local.email
            }, function (err, user) {
                if (req.body.newemail) {
                    console.log("SERVER:checking format of new email");
                    if (!req.body.newemail.includes("[$%^&*:;\\/|<>\"\'!.,-\s+]")) {
                        console.log("SERVER:formatted correctly");
                        user.local.email = req.body.newemail;
                        user.save();
                    }
                } else if (req.body.newpwd) {
                    console.log("SERVER:checking format of new password");
                    if (!req.body.newpwd.includes("[$%^&*:;\\/|<>\"\'!.,-\s+]")) {
                        console.log("SERVER:formatted correctly");
                        user.local.password = req.body.newpwd;
                        user.save();
                    }
                }
                console.log("SERVER:successfully updated user profile");
                res.redirect('/profile');
            });
        });
    });

    return router;
}
