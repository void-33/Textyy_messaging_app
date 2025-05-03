const mongoose = require("mongoose");

const roomCardShema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      default: null,
    },
    participants: [
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
      default: Date.now(),
    },
  },
  { timestamps: true }
);

roomCardShema.pre("validate", function (next) {
  if (this.isGroup) {
    if (!this.groupId) {
      return next(new Error("Group chats must have a groupId."));
    }
    if (this.participants.length!==0) {
      return next(
        new Error("Group chats should not have participants directly.")
      );
    }
  } else {
    if (this.participants?.length !== 2) {
      return next(new Error("Private chats must have exactly 2 participants."));
    }
    if (this.groupId) {
      return next(new Error("Private chats must not have a groupId."));
    }
  }
  next();
});

module.exports = mongoose.model("roomCard", roomCardShema);
