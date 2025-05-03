const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Creator must be provided"],
    },
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

ChatRoomSchema.path('admin').validate(function (value){
    return value.length > 0;
},"At least one admin is required");

ChatRoomSchema.path('members').validate(function (value){
    return value.length > 0;
},"At least one member is required");

module.exports = mongoose.model("chatRoom", ChatRoomSchema);
