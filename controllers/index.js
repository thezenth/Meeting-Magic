var express = require('express')
var router = express.Router();

// index page
router.get('/', function(req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

// about page
router.get('/about', function(req, res) {
  res.render('about');
});

module.exports = router;
