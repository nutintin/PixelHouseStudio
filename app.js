var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongojs = require('mongojs');
var db = mongojs('PixelHouseStudio',['PixelHouseStudio']);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/css', express.static('css'));
app.use('/css/js', express.static('js'));
app.use('/js', express.static('js'));
app.use(express.static(__dirname + "/css"));


app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/chat', function(req, res){
  res.sendfile('chat.html');
});

app.get('/PixelHouseStudio',function(req,res){
  console.log("I received a GET request")

  db.PixelHouseStudio.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  });


});

app.get('/PixelHouseStudio/:email/:password',function(req,res){
  console.log("I received a GET request")
  var email = req.params.email;
  var password = req.params.password;
  db.PixelHouseStudio.find({email :email ,password :password}, function(err,doc){
    res.json(doc);
  });

});


app.post('/PixelHouseStudio',function(req,res){
  console.log(req.body);
  db.PixelHouseStudio.insert(req.body,function(err,doc){
    res.json(doc);
  })
});


var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

/*users = [];
connections = [];


var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected');

  socket.on('chat message', function(msg){
    nsp.emit('chat message', msg);
  });
  
  socket.on('disconnect', function(){console.log('disconnect') });
});
nsp.emit('hi', 'everyone!');
*/

http.listen(3000, function(){
  console.log('listening on *:3000');
});
