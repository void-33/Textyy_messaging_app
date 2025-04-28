const Message = require("./models/messageModel");
const jwt = require('jsonwebtoken');

const users = {}

module.exports = (io) => {
    // give accessToken as query in socket io 
    io.use((socket,next)=>{
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

        socket.on('register', (userId) => {
            users[socket.userId] = socket.id;
        });

        socket.on('chatMessage', async (msgdata) => {
            console.log(`${socket.username}- ${msgdata}`);
            socket.broadcast.emit('chatMessage',msgdata);
        })

        socket.on('disconnect', () => {
            // console.log(`User disconnected: ${socket.id}`);
        })
    })
}