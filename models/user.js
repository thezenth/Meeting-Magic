var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    index: true
  },
  food_prefs: [String]
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}
