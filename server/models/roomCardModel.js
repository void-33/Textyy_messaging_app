const mongoose = require("mongoose");

const roomCardShema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },

    //identifier for room
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      required: [true, "Room Id is required for a roomCard"],
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

roomCardShema.pre("validate", function (next) {
  if (!this.isGroup && this.members?.length !== 2) {
    return next(new Error("Private chats must have exactly 2 members."));
  }
  next();
});

module.exports = mongoose.model("roomCard", roomCardShema);
