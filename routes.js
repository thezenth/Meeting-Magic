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

// debug.js
var debug = require("./libs/debug/debug");
var dlog = debug.dlog;
var def_opts = {
	id: "server",
	isWarning: false,
	isError: false
}

//url module
var url = require('url');

module.exports = function (app, passport) {
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
		res.render('home', {
			user: req.user
		}); //get the user out of session and pass to template
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
			//dlog("session: " + req, def_opts);
			//dlog("session: user is " + req.user, def_opts);
			dlog("session: user email is " + req.user.local.email, def_opts);
			User.findOne({
				'local.email': req.user.local.email
			}, function (err, user) {
				dlog("got foodprefs: " + req.body.foodprefs, def_opts);
				user.food_prefs = req.body.foodprefs;
				user.save();
				dlog("successfully updated user", def_opts);
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
			dlog("session: user email is " + req.user.local.email, def_opts);
			dlog("post: new email is " + req.body.newemail, def_opts);
			User.findOne({
				'local.email': req.user.local.email
			}, function (err, user) {
				if (req.body.newemail) {
					dlog("checking format of new email...", def_opts);
					if (!req.body.newemail.includes("[$%^&*:;\\/|<>\"\'!.,-\s+]")) {
						dlog("formatted correctly!", def_opts);
						user.local.email = req.body.newemail;
						user.save();
					}
				} else if (req.body.newpwd) {
					dlog("checking format of new password...", def_opts);
					if (!req.body.newpwd.includes("[$%^&*:;\\/|<>\"\'!.,-\s+]")) {
						dlog("formatted correctly!", def_opts);
						user.local.password = req.body.newpwd;
						user.save();
					}
				}
				dlog("successfully updated user", def_opts);
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
		//dlog("recived post", def_opts);
		process.nextTick(function () {
			//dlog("test, before mongodb check", def_opts);

			User.findOne({
				'local.email': req.body.otheremail
			}, function (err, user) {
				dlog("checking mongodb", def_opts);
				dlog("other email:" + req.body.otheremail, def_opts);
				if (err) {
					dlog(err, {
						id: "server",
						isError: true,
						isWarning: false
					});
				}

				if (user) {
					if((user.food_prefs.length > 0) && (req.user.food_prefs.length > 0)) {
						lat = parseFloat(req.body.coords.substring(
							0, req.body.coords.indexOf(',')
						));
						long = parseFloat(req.body.coords.substring(
							req.body.coords.indexOf(',') + 1, req.body.coords.length
						));
						dlog("coords:" + lat + "," + long, def_opts);

						var rest_pq = food_q;
						rest_pq.position = {
							lat: lat,
							long: long
						};
						rest_pq.rad = 5000;
						rest_pq.rankBy = "prominence";

						var sameFoodPrefs = compare_food_prefs(user.food_prefs, req.user.food_prefs);
						if(sameFoodPrefs.length > 0) {
							rest_pq.cat = sameFoodPrefs;
							get_place(rest_pq, fetch_parse);
							var checkJson = function () {
								fs.readFile('./libs/places/data.json', function (err, jsonData) {
									if (err) {
										dlog(err, {
											id: "server",
											isError: true,
											isWarning: false
										});
									} else {
										dlog("checking ./libs/places/data.json", def_opts);
										var parsedJson = JSON.parse(jsonData);
										var found_places = parsedJson["found_places"];
										if (found_places.length > 0) {
											var redir = '/results?' + qs.stringify( { 'users': [req.user.local.email,req.body.otheremail] }, { indices : false, arrayFormat: 'brackets', encode : false } )
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
				dlog(err, {
					id: "server",
					isError: true,
					isWarning: false
				});
			} else {
				//dlog("routes.js successfully read ./libs/places/data.json", def_opts);
				parsedJson = JSON.parse(jsonData);
				//dlog("parsedJson:"+JSON.stringify(parsedJson, null, 4), def_opts);
				found_places = parsedJson["found_places"];
				top5 = found_places.slice(0, 5); //gets top 5 restaurants
				//dlog("top 5:"+top5[top5.length-1].name, def_opts);
				res.render('results', {
					places: top5
				});

				resultsRests = top5; //save the results for use in app.post for results

				//dlog("wiping data.json found_places", def_opts);
				parsedJson["found_places"] = [];
				fs.writeFile('./libs/places/data.json', JSON.stringify(parsedJson, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs
			}
		});
	});

	app.post('/results', isLoggedIn, function(req, res) {

		dlog('query:' + resultsQuery['users[]'], def_opts)
		//console.log(req.body.idx);
		newMeeting = new Meeting({
			users: resultsQuery['users[]'],
			place: resultsRests[req.body.idx], //remeber, this comes back as a string!
			date: "",
			time: ""
		});

		dlog("created a new meeting:" + newMeeting, def_opts);
		newMeeting.save();
		var redir = '/create?meetid=' + newMeeting._id ;//qs.stringify( { 'meetid': newMeeting._id }, { indices : false, encode : false } ) ;
		res.redirect(redir);
	});

	var createQuery = {};

	app.get('/create', isLoggedIn, function(req, res) {
		//Get and save the query string
		//console.log(req.url);
		var url_parts = url.parse(req.url, true);
		//console.log(url_parts);
		var query = url_parts.query;
		createQuery = query;

		Meeting.findOne({ '_id':createQuery.meetid }, function(err, m) {
			if (err) {
				dlog(err, {
					id: "server",
					isError: true,
					isWarning: false
				});
			}

			if (m) {
				//dlog(m, def_opts);
				//dlog(m.place.name, def_opts);
				res.render('create', {meeting: m});
			}
		});
	});

	app.post('/create', isLoggedIn, function(req, res) {
		Meeting.findOne({ '_id':createQuery.meetid }, function(err, m) {
			if (err) {
				dlog(err, {
					id: "server",
					isError: true,
					isWarning: false
				});
			}

			if (m) {
				m.time = req.body.time;
				m.date = req.body.date;
				m.save();
				dlog("update a meeting:\n" + m, def_opts);
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
