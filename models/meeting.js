// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var meetingSchema = mongoose.Schema({

    users            : [String],
    place            : Object,
    date             : String,
    time             : String,
    status           : Boolean // if true, then all parties ahve accepted this meeting- if false, than all parties have not, and it is not considered "accepted"

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Meetings', meetingSchema);
