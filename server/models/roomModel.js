const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    //identifier for both grp and dms
    //grp-grpname
    //dm - userId1_userId2
    name: {
      type: String,
      required: [true,'Room name is required'],
    },
    isGroup:{
      type: Boolean,
      default: false,
    },
    //at least 2 for grp and exactly 2 for dms
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    //1 for a grp
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    //all memebers in a grp can be grp
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
