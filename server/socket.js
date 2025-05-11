const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const battleModel = require('./models/battle.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (userId) => {
            try {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            } catch (error) {
                console.error('Error updating user socket ID:', error);
            }
        });

        // Listen for "battleRoom" event to update battle model socket fields
        socket.on('battleRoom', async (roomId) => {
            try {
                const battle = await battleModel.findOne({ roomCode: roomId });
                if (battle) {
                    if(!battle.user1SocketId) {
                        battle.user1SocketId = socket.id;
                        await battle.save();
                        console.log(`Assigned user1SocketId for room ${roomId}: ${socket.id}`);
                    } else if (!battle.user2SocketId) {
                        battle.user2SocketId = socket.id;
                        await battle.save();
                        console.log(`Assigned user2SocketId for room ${roomId}: ${socket.id}`);
                    } else {
                        console.log(`Both user socket IDs already assigned for room ${roomId}`);
                    }
                } else {
                    console.log(`Battle not found for room ID: ${roomId}`);
                }
            } catch (error) {
                console.error('Error updating battle socket IDs:', error);
            }
        });

        // Optional: Automatically join the socket to a room—with roomId if needed
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