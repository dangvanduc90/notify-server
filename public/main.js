var socket = io('http://localhost:3000/');
$(document).ready(function () {
    $("#loginForm").show();
    $("#chatForm").hide();

    $("#btnRegister").click(function () {
        let username = $("#txtUsername").val().trim();
        $("#txtUsername").val("");
        socket.emit("client-send-username", username);
    });

    $("#btnLogout").click(function () {
        socket.emit("logout");
    });

    $("#btnSendMessage").click(function () {
        let message = $("#txtMessage").val().trim();
        socket.emit("user-send-message", message);
        $("#txtMessage").val("");
    });
    
    $("#txtMessage").focusin(function () {
        socket.emit("typing");
    });
    $("#txtMessage").focusout(function () {
        socket.emit("not-typing");
    });

    socket.on('server-send-dki-thatbai', function () {
        $("#alert").html("Username da ton tai");
        setTimeout(function () {
            $("#alert").slideUp();
        }, 3000);
    });
    socket.on('server-send-dki-thanhcong', function (data) {
        $("#currentUser").html(data);
        $("#loginForm").hide(2000);
        $("#chatForm").show(2000);
    });
    socket.on('server-send-danhsach-users', function (data) {
        $("#boxContent").empty();
        data.forEach(function (item) {
            $("#boxContent").append('<div class="userOline">' + item + '</div>');
        });
    });
    socket.on('logout', function () {
        $("#loginForm").show();
        $("#chatForm").hide();
    });
    socket.on('server-send-message', function (data) {
        $("#listMessage").append('<div class="msg">' + data.username + ': ' + data.content + '</div>');
    });

    socket.on('server-send-typing', function (data) {
        $("#typing").append('<p id="' + data + '">' + data + ' is typing</p>');
    });
    socket.on('server-send-not-typing', function (data) {
        console.log(data);
        $("#typing").find('#'+data).remove();
    });
});