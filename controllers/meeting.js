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

    router.get('/', function (req, res) {
        res.render('meeting', {
            message: req.flash('meetingMessage')
        });
    });

    router.post('/', function (req, res) {
        process.nextTick(function () {
            User.findOne({
                'local.email': req.body.otheremail
            }, function (err, user) {
                console.log("SERVER:checking mongodb");
                console.log(`CLIENT: other email- ${req.body.otheremail}`);
                if (err) {
                    console.error(err);
                }

                if (user) {
                    if ((user.food_prefs.length > 0) && (req.user.food_prefs.length > 0)) {
                        lat = parseFloat(req.body.coords.substring(
                            0, req.body.coords.indexOf(',')
                        ));
                        long = parseFloat(req.body.coords.substring(
                            req.body.coords.indexOf(',') + 1, req.body.coords.length
                        ));
                        console.log(`SERVER: ${lat},${long}`);

                        //var rest_pq = food_q;
                        //rest_pq.position = {
                        //    lat: lat,
                        //    long: long
                        //};
                        //rest_pq.rad = 5000;
                        //rest_pq.rankBy = "prominence";

                        var sameFoodPrefs = compare_food_prefs(user.food_prefs, req.user.food_prefs);
                        if (sameFoodPrefs.length > 0) {
                            //rest_pq.cat = sameFoodPrefs;
                            get_place({lat: lat, lng: long}, sameFoodPrefs, fetch_parse);
                            var checkJson = function () {
                                fs.readFile('./libs/places/data.json', function (err, jsonData) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log("SERVER:checking ./libs/places/data.json");
                                        var parsedJson = JSON.parse(jsonData);
                                        var found_places = parsedJson["found_places"];
                                        if (found_places.length > 0) {
                                            var redir = '/results?' + qs.stringify({
                                                'users': [req.user.local.email, req.body.otheremail]
                                            }, {
                                                indices: false,
                                                arrayFormat: 'brackets',
                                                encode: false
                                            });
                                            res.redirect(redir);
                                            clearInterval(interval);
                                        }
                                    }
                                });
                            }
                            var interval = setInterval(checkJson, 100);
                        }
                    } else {
                        req.flash('meetingMessage', 'At least one user has no food preferences.');
                        res.redirect('/meeting');
                    }
                } else {
                    req.flash('meetingMessage', 'This user does not exist.');
                    res.redirect('/meeting');
                }
            });
        });
    });

    return router;
}
