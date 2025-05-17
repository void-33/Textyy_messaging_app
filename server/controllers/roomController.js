const Room = require("../models/roomModel");
const RoomCard = require("../models/roomCardModel");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");

//GET /api/rooms/getbyid/:roomId
const getRoomById = async (req, res) => {

  const currUserId = req.userId;
  const { roomId } = req.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(404).json({ success: false, message: "No such room" });
    }

    const room = await Room.findById(roomId).populate(
      "members",
      "_id username"
    );

    if (
      !room ||
      !room.members.some((member) => member._id.toString() === currUserId)
    )
      return res.status(404).json({ success: false, message: "No such room" });

    const roomObj = room.toObject();
    if (!roomObj.isGroup) {
      const otherUser = roomObj.members.find(
        (member) => member._id.toString() !== currUserId
      );
      roomObj.name = otherUser.username;
    }

    return res
      .status(200)
      .json({ success: true, message: "Room fetched successfully", roomObj });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//funciton to create a new group chat
//POST /api/rooms/create
const createGroup = async (req, res) => {
  const currUserId = req.userId;
  try {
    const members = req.body.members || [];
    const currUser = await User.findById(currUserId);
    const currFriends = currUser.friends.map(String);

    //check if group name exists
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: 'Group Name cannot be empty' });
    }

    // Check if all members are friends
    for (const member of members) {
      if (!currFriends.includes(member._id)) {
        return res.status(400).json({
          success: false,
          message: "You cannot add someone who is not your friend in the group",
        });
      }
    }

    // Avoid duplicates and ensure the current user is in the list
    const uniqueMembers = Array.from(new Set([...members, currUserId]));

    if (uniqueMembers.length < 2) {
      return res.status(400).json({ success: false, message: "There must be atleast 2 members" });
    }

    const room = await Room.create({
      name: req.body.name,
      isGroup: true,
      members: uniqueMembers,
      creator: currUserId,
      admin: [currUserId],
    });

    await RoomCard.create({
      isGroup: true,
      roomId: room._id,
      members: uniqueMembers
    });

    return res
      .status(200)
      .json({ success: true, message: "Group created successfully", room });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//PATCH /api/rooms/rename
const renameGroup = async (req, res) => {
  const currUserId = req.userId;
  const { roomId, newName } = req.body;
  try {
    const room = await Room.findById(roomId);

    if (!room || !room.isGroup || !room.members.includes(currUserId))
      return res.status(404).json({ success: false, message: "No such room" });

    room.name = newName;
    await room.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Group name Changed Successfully",
        room,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getRoomById, createGroup, renameGroup };
