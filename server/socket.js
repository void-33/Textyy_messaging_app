const Message = require("./models/messageModel");

module.exports = (io) => {
    io.on('connection', (socket) => {
        // console.log(`User connected: ${socket.id}`);
        socket.on('register', (userId) => {
            socket.userId = userId;
        });

        socket.on('chatMessage', async (msgdata) => {
            const { senderId, receiverId, content } = msgdata;
            if (!senderId || !receiverId || !content) return;

            if(senderId !== socket.userId){
                socket.emit('error', {message: 'Failed to send message'});
                return;
            }

            try {
                const message = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    content,
                })

                await message.save();
                socket.emit('chatMessageSent',message);

                //emit message to reciever(if connected)
                for (const [id, socketInstance] of io.of('/').sockets) {
                    if (socketInstance.userId === receiverId) {
                        socketInstance.emit('chatMessage', message);
                    }
                }
            } catch (err) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        })

        socket.on('disconnect', () => {
            // console.log(`User disconnected: ${socket.id}`);
        })
    })
}