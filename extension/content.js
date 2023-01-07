

const socket = io.connect("https://continuitybrowser.com");

socket.on('connect', function () {
    console.log("User connected")
});

socket.on('disconnect', function () {
    console.log("User disconnected")
});