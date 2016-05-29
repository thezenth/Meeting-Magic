var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var fs = require('fs');
var PythonShell = require('python-shell');

var encoding = require("encoding");

function dbg(state) {
  console.log("# SERVER_DEBUG:" + state)
}

function checkPythonOut(text) {
  id = 'DEBUG'
  if (text.indexOf(":") != -1) {
    id = text.substring(
      0,
      text.indexOf(':')
    );
  }
  console.log("ID:"+id)
  switch(id) {
    case 1:
      id = 'DEBUG'
      console.log(text)
      break;
    case 2:
      id = 'USER_AUTH'
      console.log(text)
      app.get('/', function(req, res){
        res.sendFile(__dirname + '/meeting.html');
      });
  }
};


//Options for py-node.py in Python-Shell
//Check https://www.npmjs.com/package/python-shell for options
var options = {
  mode: 'text'
};

app.use(express.static(__dirname + '/views'));
/*app.get('/meeting.html', function(req, res){
  console.log('DEBUG:THIS IS THE FIRST APP.GET')
  //res.redirect('127.0.0.1:3000/index.html')
  res.sendFile('/meeting.html');
});*/

//DEFINING NAMESPACES
// maybe have a text file for this..?
var index_nsp = io.of('/index-nsp')
var meeting_nsp = io.of('/meeting-nsp')
var results_nsp = io.of('/results-nsp')


index_nsp.on('connection', function(socket){

  dbg("Recieving connection to index.html");
  socket.on('_userInfo', function(userInfo){
    dbg("Recieving user info");
    dbg(userInfo);

    //get username and password out of string formatted like username=USERNAME&password=PASSWORD
    username = userInfo.substring(
      userInfo.indexOf("=") + 1, //returns first index of = sign
      userInfo.indexOf("&")
    );
    password = userInfo.substring(
      userInfo.lastIndexOf("=") + 1, //returns the second index of the = sign
      userInfo.length
    );

    console.log("USERNAME:" + username);
    console.log("PASSWORD:" + password);

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
      //message = encoding.convert(message, '');
      id = ''
      if (message.indexOf(":") !== -1) {
        //console.log("HELLO");
        id = message.substring(
          0,
          message.indexOf(':')
        );
      }
      switch(id) {
        case 'DEBUG':
          console.log(message)
          break;
        case 'USER_AUTH':
          console.log(message)
          //AFTER USER AUTHENTICATION AND SUCH, LOAD THE MEETING PAGE TO ACTUALLY SETUP THE MEETING
          //console.log('ID IS USER_AUTH')
          //console.log('DEBUG:CHANGING HTML TO meeting.html');
          //app.get('/meeting', function (req, res) {
          //  res.render('meeting.html');
          //});
          //meeting_body = '<body id="main body"><form action="" onsubmit="javascript:sendMeetingInfo();">Other user: <input id="otherUser" autocomplete="off" /><br>Coordinates: <input id="coords" autocomplete="off"/><br><button>Submit</button></form></body>'
          /*fs.readFile('meeting.html', function (err,data) {
            if (err) {
              return console.log(err);
            }
            meeting_body = data;
          });*/
          //console.log(meeting_body);
          //io.emit('change_page', {
          // body: '_TEST'
          //});
          break;
        default:
          console.log(message)
          break;
      }
    });


  });
});

meeting_nsp.on('connection', function(socket){
  dbg("Recieving connection to meeting.html")
  socket.on('_meetingInfo', function(meetingInfo){
    console.log("HELLO I AM MEETING INFO");
    console.log('RECIEVED:' + meetingInfo);
    otherUser = meetingInfo.substring(
      meetingInfo.indexOf("=") + 1, //returns first index of = sign
      meetingInfo.indexOf("&")
    );
    coordsWhole = meetingInfo.substring(
      meetingInfo.lastIndexOf("=") + 1, //returns the second index of the = sign
      meetingInfo.length
    );
    lat = coordsWhole.substring(
      0,
      coordsWhole.indexOf(",")
    );
    lon = coordsWhole.substring(
      coordsWhole.indexOf(",") + 1,
      coordsWhole.length
    );

    console.log("OTHER_USER:" + otherUser);
    console.log("COORDINATES:" + lat + "," + lon);

    info = {};
    info.otherUser = otherUser;
    info.lat = lat;
    info.lon = lon;

    //read the existing data.json file, and parse that into a local dictionary like JSON structure
    fs.readFile('data.json', function (err, data) {
      var json = JSON.parse(data);
      //edit the dictionary-JSON structure to reflect newly recieved username and password
      json[1]['meetingInfo'][0]['otherUser'] = info.otherUser;
      json[1]['meetingInfo'][0]['lat'] = info.lat;
      json[1]['meetingInfo'][0]['lon'] = info.lon;
      //write the edited structure in its entirity to the data.json file
      fs.writeFile('data.json', JSON.stringify(json, null, '\t')); //also, include null and '\t' arguments to keep the data.json file indented with tabs
    });
    var pyshell1 = new PythonShell('match.py', { mode: 'text' });
    pyshell1.on('message', function (message) {
      //message = encoding.convert(message, '');
      id = ''
      if (message.indexOf(":") !== -1) {
        //console.log("HELLO");
        id = message.substring(
          0,
          message.indexOf(':')
        );
      }
      switch(id) {
        case 'DEBUG':
          console.log(message)
          break;
        case 'USER_AUTH':
          console.log(message)
          //AFTER USER AUTHENTICATION AND SUCH, LOAD THE MEETING PAGE TO ACTUALLY SETUP THE MEETING
          //console.log('ID IS USER_AUTH')
          //console.log('DEBUG:CHANGING HTML TO meeting.html');
          //app.get('/meeting', function (req, res) {
          //  res.render('meeting.html');
          //});
          //meeting_body = '<body id="main body"><form action="" onsubmit="javascript:sendMeetingInfo();">Other user: <input id="otherUser" autocomplete="off" /><br>Coordinates: <input id="coords" autocomplete="off"/><br><button>Submit</button></form></body>'
          /*fs.readFile('meeting.html', function (err,data) {
            if (err) {
              return console.log(err);
            }
            meeting_body = data;
          });*/
          //console.log(meeting_body);
          //io.emit('change_page', {
          // body: '_TEST'
          //});
          break;
        default:
          console.log(message)
          break;
      }
    });
    socket.emit("change_html", "_TEST") // Once the python is done and results.html has been updated, tell the client's meeting.html to change the page to results.html

  });
});

results_nsp.on('connection', function(socket){
  dbg("Recieving connection to results.html");
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
