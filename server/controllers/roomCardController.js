const Room = require("../models/roomModel");
const RoomCard = require("../models/roomCardModel");

// GET /api/roomcards/getroomcards
const getUserRoomCards = async (req, res) => {
  const userId = req.userId;
  try {
    const groups = await Room.find({ isGroup: true, members: userId })
      .select("_id")
      .lean();

    const groupIds = groups.map((group) => group._id);

    const roomCards = await RoomCard.find({
      $or: [
        { isGroup: false, participants: userId },
        { isGroup: true, groupId: { $in: groupIds } },
      ],
    })
      .populate("participants", "_id username")
      .populate("groupId", "_id name")
      .sort({ lastMessageAt: -1 });

    //in the particpants array only include the othrs user's detail
    const filteredRoomCards = roomCards.map((roomCard) => {
      if (!roomCard.isGroup) {
        const roomCardObj = roomCard.toObject();

        const otherUser = roomCardObj.participants.find(
          (participant) => participant._id.toString() !== userId
        );
        roomCardObj.otherUser = otherUser;
        return roomCardObj;
      }
      return roomCard;
    });

    return res.status(200).json({
      success: true,
      messsage: "Room cards fetched successfully",
      roomCards: filteredRoomCards,
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getUserRoomCards };
