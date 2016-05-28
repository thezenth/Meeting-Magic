var express = require('express');
var app = express();

var jf = require('jsonfile')



app.get('/', function (req, res) {

  //JSON
  jf.readFile('./data.json', function(err, obj) {
    res.send(obj[0]["html"])
  });

});



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});
