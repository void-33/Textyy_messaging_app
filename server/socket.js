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

    socket.on("joinRoom", async (roomId) => {
      const room = await Room.findById(roomId);
      if (room) socket.join(roomId);
    });

    socket.on("message", async (roomId, content) => {
      if (!socket.rooms.has(roomId)) {
        return; // reject the message silently or emit an error
      }
      
      const roomCard = await RoomCard.findOne({ roomId });

      if(!roomCard.members.includes(socket.userId)){
        return;
      }

      const message = await Message.create({
        sender: socket.userId,
        content,
        roomId,
      });


      roomCard.lastMessage = content;
      roomCard.lastMessageAt = Date.now();
      await roomCard.save();

      io.to(roomId).emit("message", roomId, message);
    });

    socket.on("disconnect", () => {});
  });
};
