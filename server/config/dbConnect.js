const mongoose = require('mongoose');

async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGO_LOCAL_URI);
    } catch (err) {
        console.log('Error connecting to the database. Try again later');
    }
}
module.exports = connectToMongo;