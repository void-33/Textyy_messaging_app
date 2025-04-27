const mongoose = require("mongoose");
const { Schema } = mongoose;

const friendRequestSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
    },
    delcinedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true })

friendRequestSchema.index({delcinedAt:1},{expireAfterSeconds: 365 * 24 * 60 * 60}); //1 year

module.exports = mongoose.model('friendRequest', friendRequestSchema);