// set up ======================================================================
// get all the tools we need
var debug = require("./libs/debug/debug");
var http = require('http');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

var server = http.createServer(app);
//socket.io
var io = require('socket.io')(server);

//namespaces
//home page namespaces

var port = 8080;

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// some custom middleware
function reqLog(req, res, next) {
    console.log(req.method + ':' + req.url);
    next();
}
//app.use(reqLog);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
var cookieParse = cookieParser(); //cookie parsing must come before session middleware
io.use(function(socket, next) {
	cookieParse(socket.request, socket.request.res, next);
});
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'isthisactuallyworking'
})); // session secret
var sessionMiddleware = session({
    secret: "isthisactuallyworking",
});
io.use(function(socket, next) {
	socket.request.originalUrl = socket.request.url; //have to do this because it expects an originalUrl but does not have one
	sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//path to page views
app.set('views', __dirname + '/views/pages');

//css and other external files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname + '/public/assets/images'));


// routes ======================================================================
require('./routes.js')(io, app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
server.listen(8080);
