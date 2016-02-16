var express = require("express");
var app = express();
var path = require("path");
var session = require('express-session');

app.use(session({secret: 'codingdojorocks'}));  // string for encryption
app.use(express.static(path.join(__dirname, "./static")));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// var mongoose = require('mongoose');
var messages = [];

var server = app.listen(5000, function(){
  console.log('listening on 5000')
});
var io = require ('socket.io').listen(server)
io.sockets.on('connection', function(socket) {
    console.log('started');
    console.log(socket.id);
    
    
    socket.on('sign_in', function(data){
        //load all previous messages
        socket.emit("old_messages", {message: messages});
        //add new user connection message
        var new_user = data.name + ' has joined the chat';
        console.log(data)
        //push new message to messages array
        messages.push(new_user);
        //broadcast to everyone but recently joined user the updated messages
        socket.broadcast.emit('user_connected', {message: new_user})
    });

    //when we get a new message from the user
    socket.on('send_message', function(data){
    //push that to the array of messages
    messages.push(data.message);
    //make it into an object
    var newMessage = data.message
    
    io.emit('new_message', {messages: newMessage})
    
    })
});

app.get('/', function(req, res){
	res.render('index' );
})