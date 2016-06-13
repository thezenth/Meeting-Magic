//preferences.js
prefs = require('./config/preferences.js');
Foods = prefs.Foods;

var User = require('./models/user');

//fetch and google places stuff
var fetch = require('./libs/places/fetch');
var get_place = fetch.get_place;

var restaurants = require('./libs/places/restaurants');
var fetch_parse = restaurants.fetch_parse;

var places = require('./libs/places/places');
var food_q = places.Food;

// debug.js
var debug = require("./libs/debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
	id: "server",
	isWarning: false,
	isError: false
}

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
		res.render('home', {user: req.user });//get the user out of session and pass to template
	});

	//Logout
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	//user-prefs
	app.get('/user-prefs', isLoggedIn, function (req, res) {
		res.render('user-prefs', {userPrefs: {foodprefs: req.user.food_prefs},foods: Foods});
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
		res.render('profile', {user: req.user});
	});

	app.post('/profile', function (req, res) {
		process.nextTick(function () {
			dlog("session: user email is " + req.user.local.email, def_opts);
			User.findOne({'local.email': req.user.local.email}, function (err, user) {
				if (typeof req.body.newemail != 'undefined') {
					dlog("checking format of new email...", def_opts);
					if (req.body.newemail.includes("/^$|\s+/")) {
						user.local.email = req.body.newemail;
						user.save();
					}
				} else if (typeof req.body.newpwd != 'undefined') {
					dlog("checking format of new password...", def_opts);
					if (req.body.newpwd.includes("/^$|\s+/")) {
						user.local.password = req.body.newpwd;
						user.save();
					}
				}
				dlog("successfully updated user", def_opts);
				res.redirect('/profile');
			});
		});
	});

	app.get('/meeting', isLoggedIn, function(req, res) {
		res.render('meeting');
	});

	app.post('/meeting', function(req, res) {
		process.nextTick(function() {
				User.findOne({'local.email': req.body.otheremail}, function(err, user) {
					if(user) {
						var rest_pq = food_q;
						rest_pq.position = {
							lat: 34.058583,
							long: -118.416582
						};
						rest_pq.rad = 5000;
						rest_pq.cat = "coffee";
						rest_pq.rankBy = "prominence";

						get_place(rest_pq, fetch_parse);
						var checkJson = function() {
							fs.readFile('./libs/places/data.json', function(err, jsonData) {
								if(err) {
									dlog(err, {id: "server", isError:true, isWarning:false});
								}
								else {
									dlog("checking ./libs/places/data.json", def_opts);
									var parsedJson = JSON.parse(jsonData);
									var found_places = parsedJson["found_places"];
									if(found_places.length > 0) {
										res.redirect('/results');
										clearInterval(interval);
									}
								}
							});
						}
						var interval = setInterval(checkJson, 1000);
					}
				});
		});
	});

	app.get('/results', isLoggedIn, function(req, res) {
		fs.readFile('./libs/places/data.json', function (err, jsonData) {
			if(err) {
				dlog(err, {id: "server", isError:true, isWarning:false});
			}
			else {
				dlog("routes.js successfully read ./libs/places/data.json", def_opts);
				var parsedJson = JSON.parse(jsonData);
				var found_places = parsedJson["found_places"];
				var top5 = found_places.slice(0, 5); //gets top 5 restaurants
				res.render('results', {places: top5});
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
