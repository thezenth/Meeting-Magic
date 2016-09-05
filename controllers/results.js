var qs = require('qs');

//preferences.js
prefs = require('../config/preferences');
Foods = prefs.Foods;

var User = require('../models/user');
var Meeting = require('../models/meeting');

//fetch and google places stuff
var fetch = require('../libs/places/fetch');
var get_place = fetch.get_place;

var restaurants = require('../libs/places/restaurants');
var fetch_parse = restaurants.fetch_parse;

//compare_prefs.js
var comp = require('../libs/compare_prefs');
var compare_food_prefs = comp.compareFood;

//async
var async = require('async');

//url module
var url = require('url');

var express = require('express');
var router = express.Router();

module.exports = function(sio, passport) {

    var resultsQuery = {};
    var resultsRests = [];

    router.get('/', function (req, res) {

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

    router.post('/', function (req, res) {

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

    return router;
}
