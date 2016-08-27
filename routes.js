var qs = require('qs');

//preferences.js
prefs = require('./config/preferences');
Foods = prefs.Foods;

var User = require('./models/user');
var Meeting = require('./models/meeting')

//fetch and google places stuff
var fetch = require('./libs/places/fetch');
var get_place = fetch.get_place;

var restaurants = require('./libs/places/restaurants');
var fetch_parse = restaurants.fetch_parse;

var places = require('./libs/places/places');
var food_q = places.Food;

//compare_prefs.js
var comp = require('./libs/compare_prefs');
var compare_food_prefs = comp.compareFood;

//async
var async = require('async');

//url module
var url = require('url');

module.exports = function (sio, app, passport) {

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

	//Home page (with login links)
	app.get('/', function (req, res) {
		res.render('index');
	});

	//Login
	app.get('/login', function (req, res) {
		//render page and pass any flash data if it exists
		res.render('login', {
			message: req.flash('signupMessage')
		});
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home', // redirect to the secure home section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.get('/signup', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', {
			message: req.flash('signupMessage')
		});
	});

	//process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/home', // redirect to the secure home section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	//home
	//want this protected so you have to be logged in to visit
	//use route middleware to verify this (the isLoggedIn function)
	app.get('/home', isLoggedIn, function (req, res) {
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

	app.post('/home', isLoggedIn, function (req, res) {
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

	//Logout
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	//user-prefs
	app.get('/user-prefs', isLoggedIn, function (req, res) {
		res.render('user-prefs', {
			userPrefs: {
				foodprefs: req.user.food_prefs
			},
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
	app.post('/user-prefs', function (req, res) {
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

	app.get('/profile', isLoggedIn, function (req, res) {
		res.render('profile', {
			user: req.user
		});
	});

	app.post('/profile', function (req, res) {
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

	app.get('/meeting', isLoggedIn, function (req, res) {
		res.render('meeting', {
			message: req.flash('meetingMessage')
		});
	});

	app.post('/meeting', function (req, res) {
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

						var rest_pq = food_q;
						rest_pq.position = {
							lat: lat,
							long: long
						};
						rest_pq.rad = 5000;
						rest_pq.rankBy = "prominence";

						var sameFoodPrefs = compare_food_prefs(user.food_prefs, req.user.food_prefs);
						if (sameFoodPrefs.length > 0) {
							rest_pq.cat = sameFoodPrefs;
							get_place(rest_pq, fetch_parse);
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

	var resultsQuery = {};
	var resultsRests = [];

	app.get('/results', isLoggedIn, function (req, res) {

		//Get and save the query string
		//console.log(req.url);
		var url_parts = url.parse(req.url, true);
		//console.log(url_parts);
		var query = url_parts.query;
		resultsQuery = query;

		fs.readFile('./libs/places/data.json', function (err, jsonData) {
			if (err) {
				console.error(err);
			} else {
				parsedJson = JSON.parse(jsonData);
				found_places = parsedJson["found_places"];
				top5 = found_places.slice(0, 5); //gets top 5 restaurants
				res.render('results', {
					places: top5
				});

				resultsRests = top5; //save the results for use in app.post for results

				parsedJson["found_places"] = [];
				fs.writeFile('./libs/places/data.json', JSON.stringify(parsedJson, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs
			}
		});
	});

	app.post('/results', isLoggedIn, function (req, res) {

		console.log(`DATABASE:${resultsQuery['users[]']}`);
		newMeeting = new Meeting({
			users: resultsQuery['users[]'],
			place: resultsRests[req.body.idx], //remeber, this comes back as a string!
			date: "",
			time: "",
			_status: false
		});

		console.log(`SERVER:created a new meeting ${newMeeting}`);
		newMeeting.save();

		var redir = '/create?meetid=' + newMeeting._id; //qs.stringify( { 'meetid': newMeeting._id }, { indices : false, encode : false } ) ;
		res.redirect(redir);
	});

	var createQuery = {};

	app.get('/create', isLoggedIn, function (req, res) {
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

	app.post('/create', isLoggedIn, function (req, res) {
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
};

//route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {
	//if user is authenticated in session, carry on
	if (req.isAuthenticated()) {
		return next(); //this is usually called before another call back function, so next says to go to the next callback function
	}

	//if they aren't, redirect to home page
	res.redirect('/');
}
