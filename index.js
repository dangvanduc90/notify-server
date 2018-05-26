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

var mangUser = [];
io.on('connection', function (socket) {
    console.log("Client connected: " + socket.id);

    socket.on('disconnect', function () {
        console.log("Client disconnected: " + socket.id);
    });

    socket.on('logout', function () {
        if (mangUser.indexOf(socket.username) != -1) {
            mangUser.splice(
                mangUser.indexOf(socket.username), 1
            );
        }

        socket.emit('logout');
        socket.broadcast.emit("server-send-danhsach-users", mangUser);
    });

    socket.on('typing', function () {
        socket.broadcast.emit("server-send-typing", socket.username);
    });

    socket.on('not-typing', function () {
        socket.broadcast.emit("server-send-not-typing", socket.username);
    });

    socket.on('client-send-username', function (data) {
        if (mangUser.indexOf(data) >= 0) { // duplicate username
            socket.emit('server-send-dki-thatbai');
        } else {
            mangUser.push(data);
            socket.username = data;
            socket.emit('server-send-dki-thanhcong', data);
            io.sockets.emit("server-send-danhsach-users", mangUser);
        }
    });

    socket.on('user-send-message', function (data) {
        io.sockets.emit("server-send-message", {username: socket.username, content: data});
    });
});

app.get('/', function (req, res) {
    res.render('trangchu');
});