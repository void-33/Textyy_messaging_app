const Room = require("../models/roomModel");

//GET /api/rooms/getbyid/:roomId
const getRoomById = async (req, res) => {
  const currUserId = req.userId;
  const { roomId } = req.params;
  try { 
    const room = await Room.findById(roomId).populate(
      "members",
      "_id username"
    );

    if (!room || !room.members.some((member) => member._id.toString() === currUserId))
      return res.status(404).json({ success: false, message: "No such room" });

    
    const roomObj = room.toObject();
    if(!roomObj.isGroup){
      const otherUser = roomObj.members.find((member)=> member._id.toString() !== currUserId)
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

module.exports = { getRoomById };
