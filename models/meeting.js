// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var meetingSchema = mongoose.Schema({

    users            : [String],
    location_ref:    : String,
    date:            : String,
    time:            : String

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Meetings', meetingSchema);
