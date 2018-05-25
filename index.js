var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function () {
    console.log("listen 3000");
});

io.on('connection', function (socket) {
    console.log("Client connected: " + socket.id);

    socket.on('disconnect', function () {
        console.log("Client disconnected: " + socket.id);
    });

    socket.on('Client-send-data', function (data) {
        console.log(socket.id + " vua gui: " + data);
        socket.emit('Server-send-data', 'can you hear me?');
    });
});

app.get('/', function (req, res) {
    res.render('trangchu');
});