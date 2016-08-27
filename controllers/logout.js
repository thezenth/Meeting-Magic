var express = require('express');
var router = express.Router();

module.exports = function(sio, passport) {

    //Logout
    router.get('/', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
