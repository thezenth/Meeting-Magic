var mongoose = require('mongoose'); //load the mongoose module, ORM for MongoDB
var User = require("../models/user.js").User;

// debug.js
var debug = require("./debug/debug.js");
dlog = debug.dlog;
def_opts = {
	id: "mongodb",
	isWarning: false,
	isError: false
}

//mongoose and db stuff
var db_name = "MeetingMagic";
mongoose.connect('mongodb://localhost/' + db_name); //connect to the database on 'localhost'

/**
 * Reads the specified user with specified password from the mongodb User collection in database MeetingMagic. Note that both username and password are searched for, and if one is incorrect, it will not find the document.
 *
 * @method read_user
 * @param {String} uname The username.
 * @param {String} pwd The password.
 * @return {Object} foundUser Only returned if a user is actually found, and there are no errors.
 */
function read_user(uname, pwd) {
	User.find({
		username: uname,
		password: pwd
	}, function (err, foundArr) {
		if (err) {
			dlog(err, {
				id: "mongodb",
				isError: true,
				isWarning: false
			});
		} else {
			if (foundArr.length > 0) {
				foundUser = foundArr[0];
				dlog("user " + foundUser.username + " exists", def_opts);
				//dlog(foundArr[0], def_opts);
				return (foundUser);
			} else {
				dlog("user " + uname + " doesn't exist", {
					id: "mongodb",
					isError: false,
					isWarning: true
				});
			}
		}
	}).limit(1);
}

/**
 * Writes a new user or updates an existing user (/replaces the existing user) to the mongodb User collection in database MeetingMagic.
 *
 * @method write_user
 * @param {String} uname The username.
 * @param {String} pwd The password.
 * @param {Array} foodPrefs The user's food preferences.
 */
function write_user(uname, pwd, foodPrefs) {
	//create new user based on User db model
	var user1 = new User({
		id: new mongoose.Types.ObjectId, //autogenerated by MongoDB
		username: uname,
		password: pwd,
		food_prefs: foodPrefs //This is an array of Strings
	});

	//save the user to the db
	user1.save(function (err, userObj) {
		if (err) {
			dlog(err, {
				id: "mongodb",
				isError: true,
				isWarning: false
			});
		} else {
			dlog("user " + userObj.username + " saved", def_opts);
		}
	});
}

//write_user("test1", "123noah123", ["Pizza", "Indian", "Sushi"]);
//read_user("test1", "123noah123");
