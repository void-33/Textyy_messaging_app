const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    content: {
        type: String,
        required: true,
    },
    groupId: {
        type: mongoose.Types.ObjectId,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('message', messageSchema);

