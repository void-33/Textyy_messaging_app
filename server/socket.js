const Message = require("./models/messageModel");
const jwt = require('jsonwebtoken');

const users = {}

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
        console.log(`User connected: ${socket.username}`);

        socket.on('register', () => {
            users[socket.userId] = socket.id;
            console.log(`${socket.userId} -> ${users[socket.userId]}`);
        });

        socket.on('joinRoom', (otherUserId) => {
            const roomId = getRoomId(socket.userId, otherUserId);
            socket.join(roomId);
        })

        socket.on('chatMessage', async ({ toUserId, content }) => {
            const roomId = getRoomId(socket.userId, toUserId);
            console.log(`${socket.username}- ${content}`);

            const message = await Message.create({
                sender: socket.userId,
                receiver: toUserId,
                content,
            })
            socket.to(roomId).emit('chatMessage', { message });
            io.to(socket.userId).emit('chatMessageSent', { message });

        })

        socket.on('disconnect', () => {
            // console.log(`User disconnected: ${socket.id}`);
        })
    })
}