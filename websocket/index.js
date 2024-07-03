const http = require('http');
const express = require('express');
const path = require('path');

const app = express();

const server = http.createServer(app);

const { Server } = require('socket.io');

const io = new Server(server);

app.use(express.static(path.resolve("./public")));

app.get('/', (req, res) => {
    return res.sendFile("/public/index.html");
});

let users = {}; // Object to keep track of connected users

io.on('connection', (socket) => {
    socket.on('set nickname', (nickname) => {
        socket.nickname = nickname;
        users[socket.id] = nickname; // Add user to the list
        io.emit('user list', Object.values(users)); // Broadcast updated user list
        io.emit('user connect', `User ${nickname} has connected`);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('private message', (data) => {
        const targetSocket = Object.keys(users).find(key => users[key] === data.to);
        if (targetSocket) {
            io.to(targetSocket).emit('private message', { from: data.from, text: data.text });
        }
    });

    socket.on('disconnect', () => {
        const nickname = socket.nickname;
        delete users[socket.id]; // Remove user from the list
        io.emit('user list', Object.values(users)); // Broadcast updated user list
        io.emit('user disconnect', `User ${nickname || socket.id} has disconnected`);
    });
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
