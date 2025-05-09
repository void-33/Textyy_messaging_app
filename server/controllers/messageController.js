const User = require('../models/userModel');
const Message = require('../models/messageModel');

//function to send message
//expected req.body = receiverId,content
//endpoint /api/message/send
const sendMessage = async (req, res) => {
    const senderId = req.userId;
    const { receiverId, content } = req.body;

    //basic validations
    if (!receiverId || !content) {
        return res.status(400).json({ success: false, message: 'Receiver and content are required' });
    }

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        //check if receiver exits
        if (!receiver) {
            return res.status(404).json({ success: false, message: 'Receiver not found' });
        }

        //check if sender and receiver are friends
        if (!sender.friends.includes(receiverId)) {
            return res.staus(403).json({ success: false, message: 'Cannot send messages to strangers.' })
        }

        //create message
        const message = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
        })
        await message.save();

        return res.status(201).json({ success: true, message: 'Message sent successfully' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

//function to get 1-1 messages
// endpoint GET /api/messages/get/:roomId 
const getMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.find({roomId}).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, message: "Messages succesfully fetched", messages });
    }catch(err){
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }
}

module.exports = { sendMessage, getMessages}