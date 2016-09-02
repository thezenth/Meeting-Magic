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

    var createQuery = {};

    router.get('/', function (req, res) {
        //Get and save the query string
        //console.log(req.url);
        var url_parts = url.parse(req.url, true);
        //console.log(url_parts);
        var query = url_parts.query;
        createQuery = query;

        Meeting.findOne({
            '_id': createQuery.meetid
        }, function (err, m) {
            if (err) {
                console.error(err);
            }

            if (m) {
                res.render('create', {
                    meeting: m
                });
            }
        });
    });

    router.post('/', function (req, res) {
        Meeting.findOne({
            '_id': createQuery.meetid
        }, function (err, m) {
            if (err) {
                console.error(err);
            }

            if (m) {
                m.time = req.body.time;
                m.date = req.body.date;
                m.save();
                console.log(`DATABASE:updated meeting-\n${m}`);

                async.each(m.users, function (u_name, callback) {

                    // Perform operation on file here.
                    console.log('Updating user ' + u_name);

                    User.findOne({
                        'local.email': u_name
                    }, function (err, user) {
                        if (err) {
                            console.error(err);
                            callback(true);
                        }

                        if (user) {
                            //userMeetingObj = { "_id": m._id, "reviewed": false, "accepted": false }; //assume these things for everyone, including person making the meeting (for now)
                            if(user.sugg_meetings.indexOf(m._id) == -1) { //push the updated meeting's id to the array if it isn't there already
                                user.sugg_meetings.push(m._id); //push the meeting obj thingie to the user
                                console.log(`DATABASE:updated user-\n${user}`);
                                user.save(); //save the user!
                            }

                            callback(null);
                        }

                    });

                }, function (err) {
                    // if any of the file processing produced an error, err would equal that error
                    if (err) {
                        // One of the iterations produced an error.
                        // All processing will now stop.
                        console.log('A user failed to update');
                    } else {
                        console.log('All users updated successfully');
                        res.redirect('/home');
                    }
                });
            }
        });
    });

    return router;
}
