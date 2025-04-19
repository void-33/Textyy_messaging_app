const mongoose = require('mongoose');
const {createServer} = require('http');
require('dotenv').config();
const {Server} = require('socket.io');

const connectToMongo = require('./config/dbConnect');
const app = require('./app') //express app

const {socketCorsOptions} = require('./config/corsOptions');

const port = process.env.PORT || 3500;

connectToMongo();

mongoose.connection.once('open',()=>{
    console.log('Connected to the database successfully');

    const server = createServer(app);

    //Initializa socket.io
    const io = new Server(server, {
        cors: socketCorsOptions
    })

    //pass io to event handling function
    require('./socket.js')(io);
    
    //listen on port 
    server.listen(port, ()=>{
        console.log(`Listening on port ${port} at http://localhost:${port}`);
    })

    //erorr handling if failure to connect to the server
    server.on('error',()=>{
        console.log('Error connecting to the server. Try again later!!!');
    })

    
    
})