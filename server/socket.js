const Message = require("./models/messageModel");
const jwt = require('jsonwebtoken');

const users = {}

function getRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
}

module.exports = (io) => {
    // give accessToken as query in socket io 
    io.use((socket, next) => {
        const token = socket.handshake.query.accessToken;
        try {
            const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            socket.username = userData.username; //save usename inside the socket
            socket.userId = userData.userId; // Save userId inside the socket
            next(); // Connection allowed
        } catch (err) {
            next(new Error('Authentication error')); // Connection denied
        }
    })
    io.on('connection', (socket) => {

        socket.on('register', () => {
            users[socket.userId] = socket.id;
            socket.join(socket.userId);
        });

        socket.on('joinRoom', (otherUserId) => {
            const roomId = getRoomId(socket.userId, otherUserId);
            socket.join(roomId);
        })

        socket.on('chatMessage', async (toUserId, content) => {
            const roomId = getRoomId(socket.userId, toUserId);
            const message = await Message.create({
                sender: socket.userId,
                receiver: toUserId,
                content,
            })
            io.to(roomId).emit('chatMessage', message);

        })

        socket.on('disconnect', () => {
            // console.log(`User disconnected: ${socket.id}`);
        })
    })
}