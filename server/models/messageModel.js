const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    roomId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('message', messageSchema);

