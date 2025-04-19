module.exports = (io) =>{
    io.on('connection',(socket)=>{
        console.log(`User connected: ${socket.id}`);

        socket.on('message',(msgdata)=>{
            console.log(`Message received: ${msgdata}`);
            io.emit('message',msgdata);
        })

        socket.on('disconnect',()=>{
            console.log(`User disconnected: ${socket.id}`);
        })
    })
}