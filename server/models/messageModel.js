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

messageSchema.pre('validate', function (next) {
    const hasReceiver = !!this.receiver;
    const hasGroupId = !!this.groupId;
  
    if ((hasReceiver && hasGroupId) || (!hasReceiver && !hasGroupId)) {
      return next(new Error('Either receiver or groupId must be provided but not both'));
    }
    next();
  });

module.exports = mongoose.model('message', messageSchema);

