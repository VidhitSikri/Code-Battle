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
                socket.userId = userId; // store userId on the socket
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            } catch (error) {
                console.error("Error updating user socket ID:", error);
            }
        });

        socket.on('battleRoom', async (roomId) => {
            try {
                const battle = await battleModel.findOne({ roomCode: roomId });
                if (battle) {
                    if (!battle.user1SocketId) {
                        battle.user1SocketId = socket.id;
                        await battle.save();
                        console.log(`Assigned user1SocketId for room ${roomId}: ${socket.id}`);
                    } else if (!battle.user2SocketId) {
                        battle.user2SocketId = socket.id;
                        await battle.save();
                        console.log(`Assigned user2SocketId for room ${roomId}: ${socket.id}`);
                        // Fetch opponent details using the stored userId
                        const opponentUser = await userModel.findById(socket.userId);
                        // Emit opponentJoined to the first user using user1SocketId.
                        io.to(battle.user1SocketId).emit("opponentJoined", { opponent: opponentUser });
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

        socket.on("newQuestion", (data) => {
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