const Message = require("./models/messageModel");
const jwt = require("jsonwebtoken");
const Room = require("./models/roomModel");
const RoomCard = require("./models/roomCardModel");
const User = require("./models/userModel");

const users = {};

function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("_");
}

module.exports = (io) => {
  // give accessToken as query in socket io
  io.use((socket, next) => {
    const token = socket.handshake.query.accessToken;
    try {
      const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.username = userData.username; //save usename inside the socket
      socket.userId = userData.userId; // Save userId inside the socket
      next(); // Connection allowed
    } catch (err) {
      next(new Error("Authentication error")); // Connection denied
    }
  });
  io.on("connection", (socket) => {
    socket.on("register", () => {
      users[socket.userId] = socket.id;
      socket.join(socket.userId);
    });

    socket.on("joinPrivateRoom", async (otherUserId) => {
      const roomId = getRoomId(socket.userId, otherUserId);

      // Step 1: Check if they're friends
      const currentUser = await User.findById(socket.userId);
      if (!currentUser.friends.includes(otherUserId)) {
        return;
      }
      let room = await Room.findOne({
        isGroup: false,
        members: { $all: [socket.userId, otherUserId] },
      });

      if (!room) {
        room = await Room.create({
          name: roomId,
          isGroup: false,
          members: [socket.userId, otherUserId],
        });
      }

      socket.join(roomId);
    });

    socket.on("joinGroup", async (group) => {
      let room = await Room.findOne({
        isGroup: true,
        members: { $in: [socket.userId] },
      });

      const members = [
        ...group.members,
        { _id: socket.userId, username: socket.username },
      ];

      if (!room) {
        room = await Room.create({
          name: group.name,
          isGroup: true,
          members,
          creator: socket.userId,
          admin: [socket.userId],
        });
        await RoomCard.create({
          isGroup:true,
          groupId: room._id
        })
      }

      socket.join(room._id);
    });

    socket.on("privateMessage", async (toUserId, content) => {
      const roomId = getRoomId(socket.userId, toUserId);
      const message = await Message.create({
        sender: socket.userId,
        receiver: toUserId,
        content,
      });

      let roomCard = await RoomCard.findOne({
        isGroup: false,
        participants: { $all: [socket.userId, toUserId] },
      });
      if (!roomCard) {
        roomCard = await RoomCard.create({
          isGroup: false,
          participants: [socket.userId, toUserId],
        });
      }
      roomCard.lastMessage = content;
      roomCard.lastMessageAt = Date.now();
      await roomCard.save();

      io.to(roomId).emit("privateMessage", message);
    });

    socket.on("groupMessage", async (groupId, content) => {
      const message = await Message.create({
        sender: socket.userId,
        groupId,
        content,
      });
      io.to(groupId).emit("groupMessage", message);
    });

    socket.on("disconnect", () => {
      // console.log(`User disconnected: ${socket.id}`);
    });
  });
};
