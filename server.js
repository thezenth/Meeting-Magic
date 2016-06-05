var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//debug.js
var debug = require("./libs/debug/debug.js");
var dlog = debug.dlog;
var def_opts = {
  id: "server",
  isWarning: false,
  isError: false
}

// /config
var configDB = require('./config/database.js');

//configuration
mongoose.connect(configDB.url);

require('./config/passport')(passport); //pass passport for configuration

//setup express application
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies (needed for auth)
app.use(bodyParser()); //get information from html forms

app.set('view engine', 'ejs'); //set up pug for templating

//required for passport
app.use(session({ secret: 'humapremkaruche'})); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

//routes
require('./routes.js')(app, passport); //load our routes and pass in our app and fully configured passport

//launch
app.listen(port);
dlog('magic happening on port ' + port, def_opts);

/*** Basic Idea ***
Example: user clicks on the "about" button on the webpage,
which redirects them to example.com/about,
which is then sent as a request ot the server which runs the "app.get" for '/about',
rendering about.pug in the browser!
*/

//view engine stuff
/*app.set('views', './views');
app.set('view engine', 'pug');

app.use(require('./controllers'));


app.listen(3000, function() {
  dlog('listening on port 3000', def_opts);
});*/
