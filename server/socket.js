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

        // Let the client join a battle room.
        socket.on("joinBattleRoom", (roomCode) => {
            socket.join(roomCode);
            console.log(`Socket ${socket.id} joined room: ${roomCode}`);
        });

        // When a new question is emitted by the creator, broadcast it to others in the room.
        socket.on("newQuestion", (data) => {
            if (data.roomCode && data.question) {
                // Send to everyone except the sender.
                socket.to(data.roomCode).emit("newQuestion", { question: data.question });
                console.log(`Emitted newQuestion to room ${data.roomCode} from socket ${socket.id}`);
            }
        });

        // When a score update happens, broadcast it.
        socket.on("scoreUpdate", (data) => {
            if (data.roomCode && data.scores) {
                socket.to(data.roomCode).emit("scoreUpdate", { scores: data.scores });
                console.log(`Emitted scoreUpdate to room ${data.roomCode} from socket ${socket.id}`);
            }
        });

        socket.on("startBattle", (data) => {
            if (data.roomCode) {
                socket.to(data.roomCode).emit("startBattle", { roomCode: data.roomCode });
                console.log(`Emitted startBattle to room ${data.roomCode}`);
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