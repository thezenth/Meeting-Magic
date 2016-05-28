var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8081, '127.0.0.1');

app.get('/', function (req, res) {
  res.sendFile('/home/noah/Meeting-Magic/Web/nodejs/index.html');
});

/*io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/

/*var listener = io.listen(server);
listener.sockets.on('connection', function(socket){
    socket.emit('message', {'message': 'hello world'});
});*/

io.sockets.on('connection', function(socket){
    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);
});

/* var express = require('express');
var app = express();

var jf = require('jsonfile')

app.get('/', function (req, res) {

  //JSON
  jf.readFile('./data.json', function(err, obj) {
    res.send(obj[0]["html"]);
  });

  jf.readFile('./data.json', function(err, obj) {
    res.send(obj[1]["_comment"]);
  });

});



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});

*/
