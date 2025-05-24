const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const battleModel = require("./models/battle.model");

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("join", async (userId) => {
            try {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            } catch (error) {
                console.error("Error updating user socket ID:", error);
            }
        });

        socket.on('battleRoom', (roomCode) => {
            socket.join(roomCode);
            console.log(`Socket ${socket.id} joined battle room: ${roomCode}`);
        });

        socket.on("newQuestion", (data) => {
            // Broadcast new question to all sockets in this battle room.
            io.to(data.roomCode).emit("newQuestion", data);
        });

        socket.on("scoreUpdate", (data) => {
            io.to(data.roomCode).emit("scoreUpdate", data);
        });

        socket.on("pointAwarded", (data) => {
            io.to(data.roomCode).emit("pointAwarded", data);
        });

        socket.on('startBattle', (data) => {
            const { roomCode, opponentSocketId } = data;
            console.log(`Battle ${roomCode} starting: instructing opponent ${opponentSocketId}`);
            if (io) {
                io.to(opponentSocketId).emit('redirectToBattle', { roomCode });
            }
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(messageObject);
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log("Socket.io not initialized.");
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };