var mongoose = require('mongoose'); //load the mongoose module, ORM for MongoDB
var db_name = "MeetingMagic";

mongoose.connect('mongodb://localhost/' + db_name); //connect to the database on 'localhost'

var User = mongoose.model('users', {username: String}); //users db model

var user1 = new User({username: 'test user'}); //create new user based on User db model
user1.username = user1.username.toUpperCase(); //make its name upper case

console.log(user1); //debug

//save the user to the db
user1.save(function (err, userObj) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Saved successfully: ', userObj);
  }
});
