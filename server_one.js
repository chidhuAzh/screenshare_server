const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002','http://192.168.18.42:3002/','http://0.0.0.0:3000'];

// Apply CORS middleware to Express
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    const clientOrigin = socket.handshake.headers.origin || 'Unknown Origin';
    console.log(`New client connected from ${clientOrigin}, Socket ID: ${socket.id}`);

    socket.on('signal', (data) => {
        console.log(`Signal received from ${clientOrigin}:`, data);
        socket.broadcast.emit('signal', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client from ${clientOrigin} disconnected, Socket ID: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
