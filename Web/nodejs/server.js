var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var PythonShell = require('python-shell');

function checkPythonOut(text) {
  id = 'DEBUG'
  if text.contains(":") {
    id = text.substring(
      0,
      text.indexOf(':')
    );
  }

  switch(id) {
    case 1:
      id = 'DEBUG'
      console.log(text)
      break;
  }
};


//Options for py-node.py in Python-Shell
//Check https://www.npmjs.com/package/python-shell for options
var options = {
  mode: 'text'
};

//Send the html file, which also has some bits of code to send data from client to server
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('_userInfo', function(userInfo){
    //console.log("HELLO");
    console.log('RECIEVED: ' + userInfo);

    //get username and password out of string formatted like username=USERNAME&password=PASSWORD
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

    //take parsed username and password into easy to handle object
    info = {};
    info.username = username;
    info.password = password;

    //read the existing data.json file, and parse that into a local dictionary like JSON structure
    fs.readFile('data.json', function (err, data) {
      var json = JSON.parse(data);
      //edit the dictionary-JSON structure to reflect newly recieved username and password
      json[1]['userInfo'][0]['username'] = info.username;
      json[1]['userInfo'][0]['password'] = info.password;
      //write the edited structure in its entirity to the data.json file
      fs.writeFile('data.json', JSON.stringify(json, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs
    });

    //new PythonShell starts running the python file
    var pyshell = new PythonShell('check_userinfo.py', { mode: 'text' });
    //listening for a message from the python file running
    pyshell.on('message', function (message) {
      checkPythonOut(message);
    });

  });
});

//Listening on port 3000
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
