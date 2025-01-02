const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = require('./config/dbConnect');
const app = require('./app') //express app

const port = process.env.PORT || 3500;

connectToMongo();

mongoose.connection.once('open',()=>{
    console.log('Connected to the database successfully');
    
    const server = app.listen(port, ()=>{
        console.log(`Listening on port ${port} at http://localhost:${port}`);
    })
    server.on('error',()=>{
        console.log('Error connecting to the server. Try again later!!!');
    })
    
})