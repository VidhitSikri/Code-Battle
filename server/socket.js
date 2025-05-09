const socketIo = require('socket.io');
const userModel = require('./models/user.model');


let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (userId) => {
            try {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} connected with socket ID: ${socket.id}`);
                
            }catch (error) {
                console.error('Error updating user socket ID:', error);
            }
        });

        socket.join('battleRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room: ${roomId}`);
        });


        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };