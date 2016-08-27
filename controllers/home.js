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

    var reqData = {};
	var meetingData = {};

	var hnsp = sio.of('/home-namespace');

	hnsp.on('connection', function (socket) {
		if (reqData.user) {
			var usr = reqData.user;
			var s_meetings = usr.sugg_meetings;
			var a_meetings = usr.acc_meetings;

			var sendMeetings_sugg = [];
			var sendMeetings_conf = [];

			if (s_meetings.length > 0) {
				async.each(s_meetings, function (mId, callback) {
					// Perform operation on file here.
					Meeting.findOne( { '_id': mId }, function (err, m) {
						if (m) {
							sendMeetings_sugg.push(m);
							callback(null);
						}
					});

				}, function (err) { //<-- callback if noah is being idiot and can't find it
					// if any of the file processing produced an error, err would equal that error
					if (err) {
						// One of the iterations produced an error.
						// All processing will now stop.
						console.log('A file failed to process');
					} else {
						socket.emit('_update_sugg_meetings', {
							sendMeetings: sendMeetings_sugg
						});
						console.log("SERVER:sent suggested meetings to client");
					}
				});
			}

			if (a_meetings.length > 0) {
				async.each(a_meetings, function (mId, callback) {
					// Perform operation on file here.
					Meeting.findOne({
						'_id': mId
					}, function (err, m) {
						if (m._status) {
							sendMeetings_conf.push(m);
						}
						callback(null);
					});

				}, function (err) { //<-- callback if noah is being idiot and can't find it
					// if any of the file processing produced an error, err would equal that error
					if (err) {
						// One of the iterations produced an error.
						// All processing will now stop.
						console.log('A file failed to process');
					} else {
						socket.emit('_update_conf_meetings', {
							sendMeetings: sendMeetings_conf
						});
						console.log("SERVER:sent confirmed meetings to client");
					}
				});
			}
		}

		socket.on('_edit', function (data) {
			console.log("SERVER:someone wants to edit a meeting");
			console.log(data.m);
		});

		socket.on('_accept', function (data) {
			console.log("SERVER:someone accepted a meeting");
			console.log(data.m);
		});
	});

    //home
    //want this protected so you have to be logged in to visit
    //use route middleware to verify this (the isLoggedIn function)
    router.get('/', function (req, res) {
        User.findOne({
            'local.email': req.user.local.email
        }, function (err, user) {
            if (err) {
                console.error(err);
            }
            // have to dothis to actually get the user...
            if (user) {
                reqData = req;
                meetingData._meetings = _meetings;
                meetingData.a_meetings = a_meetings;
                var _meetings = [];
                var a_meetings = [];
                res.render('home', {
                    _meetings: _meetings,
                    a_meetings: a_meetings
                });
            }
        });
    });

    router.post('/', function (req, res) {
        if (req.body.edit) {
            var m = JSON.parse(req.body.edit); //remember, the meeting is passed as a stringified object
            console.log(`CLIENT:editing meeting ${m._id}`);
            var redir = '/create?meetid=' + m._id; //qs.stringify( { 'meetid': newMeeting._id }, { indices : false, encode : false } ) ;
            res.redirect(redir);
        } else if (req.body.accept) {
            var m = JSON.parse(req.body.accept);
            console.log(`CLIENT:accepting meeting ${m._id}`);
            //stick into acc_meetings array
            User.findOne({ 'local.email': req.user.local.email }, function (err, user) {
                if (err) {
                    console.error(err);
                }
                // have to dothis to actually get the user...
                if (user) {
                    user.acc_meetings.push(m._id); //put into accepted meetings array
                    user.sugg_meetings.splice(
                        user.sugg_meetings.indexOf(m._id), 1
                    ); //take out of suggested meetings array
                    user.save(); //ALWAYS MAKE SURE TO SAVE!

                    console.log(`SERVER:new suggested meetings array for user ${req.user.local.email}- ${user.sugg_meetings}`);
                    console.log(`SERVER:new accepted meetings array for user ${req.user.local.email}- ${user.acc_meetings}`);

                    console.log(`SERVER:checking if all users have accepted meeting ${m._id}`);
                    var isAccepted = true;
                    Meeting.findOne( { '_id': m._id }, function(err, m) {
                        if (m) {
                            async.each(m.users, function (userEmail, callback) {
                                // Perform operation on file here.
                                User.findOne({ 'local.email': userEmail }, function (err, user) {
                                    console.log(`SERVER: checking user ${userEmail}`);
                                    console.log(`SERVER: accepted array ${user.acc_meetings}`);
                                    if (user.acc_meetings.indexOf(m._id) == -1) {
                                        isAccepted = false;
                                    }
                                    callback(null);
                                });

                            }, function (err) { //<-- callback if noah is being idiot and can't find it
                                // if any of the file processing produced an error, err would equal that error
                                if (err) {
                                    // One of the iterations produced an error.
                                    // All processing will now stop.
                                    console.log('A file failed to process');
                                } else {
                                    console.log('Succesfully checked meetings');
                                    m._status = isAccepted;
                                    m.save();
                                    console.log(`DATABASE:${m._id} status- ${m._status}`);
                                    res.redirect('/home');
                                }
                            });
                        }
                    });


                }
            });

        } else {
            console.warning("post to /home was empty");
        }
    });

    return router;
}
