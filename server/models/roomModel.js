const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'Room name is required'],
    },
    isGroup:{
      type: Boolean,
      default: false,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

roomSchema.pre("validate", function(next) {
  if (this.isGroup && !this.creator) {
    return next(new Error("Group must have a creator."));
  }
  if (!this.isGroup && this.creator) {
    return next(new Error("Private chat must not have a creator."));
  }
  if (this.isGroup && this.admin.length<1) {
    return next(new Error("Group must have at least one admin."));
  }
  if (!this.isGroup && this.admin.length !== 0) {
    return next(new Error("Private chat must not have any admins."));
  }
  if (this.isGroup && this.members.length<1) {
    return next(new Error("Group must have at least one member."));
  }
  if (!this.isGroup && this.members.length !== 2) {
    return next(new Error("Private chat must have exactly 2 members."));
  }
  next();
});

module.exports = mongoose.model("room", roomSchema);
