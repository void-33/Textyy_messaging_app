const Room = require("../models/roomModel");
const RoomCard = require("../models/roomCardModel");

// GET /api/roomcards/getroomcards
const getUserRoomCards = async (req, res) => {
  const userId = req.userId;
  try {
    const roomCards = await RoomCard.find({ members: userId })
      .populate("members", "_id username")
      .populate("roomId", "_id name")
      .sort({ lastMessageAt: -1 });

    //filter out dms with no messages
    const filteredroomCards = roomCards.filter(
      (card) => card.isGroup || card.lastMessage !== ""
    );

    //provide name for each room card- dm- ohther user's username , grp- grpname
    const namedRoomCards = filteredroomCards.map((roomCard) => {
      const roomCardObj = roomCard.toObject();
      if (roomCardObj.isGroup) {
        roomCardObj.name = roomCard.roomId?.name || "Unknown Group";
      } else {
        const otherUser = roomCardObj.members.find(
          (member) => member._id.toString() !== userId
        );
        roomCardObj.name = otherUser ? otherUser.username : "Unknown User";
      }
      return roomCardObj;
    });

    //in the particpants array only include the other user's detail
    const finalRoomCards = namedRoomCards.map((roomCard) => {
      if (!roomCard.isGroup) {
        // const roomCardObj = roomCard.toObject();
        const roomCardObj = roomCard;

        const otherUser = roomCardObj.members.find(
          (member) => member._id.toString() !== userId
        );
        roomCardObj.otherUser = otherUser;
        return roomCardObj;
      }
      return roomCard;
    });

    return res.status(200).json({
      success: true,
      messsage: "Room cards fetched successfully",
      roomCards: finalRoomCards,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// GET /api/roomcards/getbyid/:roomId
const getRoomCardbyId = async (req, res) => {
  const { roomId } = req.params;
  const currUserId = req.userId;
  try {
    const roomCard = await RoomCard.findOne({ roomId })
      .populate("members", "_id username")
      .populate("roomId", "_id name");

    if (
      !roomCard ||
      !roomCard.members.some((member) => member._id.toString() === currUserId)
    )
      return res.status(404).json({ success: false, message: "No such user" });

    const roomCardObj = roomCard.toObject();
    if (!roomCardObj.isGroup) {
      const otherUser = roomCardObj.members.find(
        (member) => member._id.toString() !== currUserId
      );
      roomCardObj.name = otherUser.username || "Unknown User";
      roomCardObj.otherUser = otherUser;
    }

    return res.status(200).json({
      success: true,
      message: "RoomCard fetched successfully",
      roomCardObj,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getUserRoomCards, getRoomCardbyId };
