var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('_userInfo', function(userInfo){
    //console.log("HELLO");
    console.log('RECIEVED: ' + userInfo);

    username = userInfo.substring(
      userInfo.indexOf("=") + 1, //returns first index of = sign
      userInfo.indexOf("&")
    );
    password = userInfo.substring(
      userInfo.lastIndexOf("=") + 1, //returns the second index of the = sign
      userInfo.length
    );

    console.log("USERNAME: " + username);
    console.log("PASSWORD: " + password);

    info = {};
    info.username = username;
    info.password = password;

    fs.readFile('data.json', function (err, data) {
      var json = JSON.parse(data);
      json[1]['userInfo'][0]['username'] = info.username;
      json[1]['userInfo'][0]['password'] = info.password;

      fs.writeFile('data.json', JSON.stringify(json, null, '\t'));
    });

  });
});

http.listen(3000, function(){
  console.log("listening on *:3000");
});


/* var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8081, '127.0.0.1');

app.get('/', function (req, res) {
  res.sendFile('/home/noah/Meeting-Magic/Web/nodejs/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

var listener = io.listen(server);
listener.sockets.on('connection', function(socket){
    socket.emit('message', {'message': 'hello world'});
});

listener.sockets.on('connection', function(socket){
  //send data to client
  //setInterval(function(){
  //  socket.emit('date', {'date': new Date()});
  //}, 1000);

  //recieve client data
  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
  });
});
*/

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
