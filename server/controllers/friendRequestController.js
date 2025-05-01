const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");
const jwt = require("jsonwebtoken");

//function to send frined request
//expected req.body = toUserId
// endpoint /api/friendrequest/send
const sendFriendRequest = async (req, res) => {
  const fromUserId = req.userId;
  if (fromUserId === req.body.toUserId) {
    return res.status(400).json({
      success: false,
      message: "Cannot send friend request to yourself",
    });
  }

  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(req.body.toUserId);

    if (!fromUser || !toUser) {
      return res
        .status(404)
        .json({ success: false, message: "User(s) not found" });
    }

    //check if they are already friends
    if (fromUser.friends.includes(req.body.toUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "You are already frineds" });
    }

    //check if there is already a pending request
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: req.body.toUserId },
        { from: req.body.toUserId, to: fromUserId },
      ],
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent or pending",
      });
    }

    //create new request and save
    const newRequest = new FriendRequest({
      from: fromUserId,
      to: req.body.toUserId,
      status: "pending",
    });

    await newRequest.save();

    return res
      .status(201)
      .json({ success: true, message: "Friend request sent successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//function to accept pending requests
//endpoint PATCH /api/friendrequest/accept/:requestId
const acceptFriendRequest = async (req, res) => {
  const currUserId = req.userId;
  const { requestId } = req.params;
  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest || friendRequest.status !== "pending") {
      return res
        .status(404)
        .json({ success: false, message: "No pending friend request found" });
    }

    if (friendRequest.to.toString() !== currUserId) {
      return res.sendStatus(403);
    }

    //add each other as friend
    await User.findByIdAndUpdate(friendRequest.from, {
      $addToSet: { friends: friendRequest.to },
    });

    await User.findByIdAndUpdate(friendRequest.to, {
      $addToSet: { friends: friendRequest.from },
    });

    //update the friend request status
    friendRequest.status = "accepted";
    await friendRequest.save();

    return res
      .status(200)
      .json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//function to decline pending requests
//endpoint DELETE /api/friendrequest/decline/:requestId
const declineFriendRequest = async (req, res) => {
  const currUserId = req.userId;
  const { requestId } = req.params;
  try {
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest || friendRequest.status !== "pending") {
      return res
        .status(404)
        .json({ success: false, message: "No pending friend request found" });
    }

    if (friendRequest.to.toString() !== currUserId) {
      return res.sendStatus(403);
    }

    //update the friend request status
    friendRequest.status = "declined";
    friendRequest.delcinedAt = new Date();
    await friendRequest.save();

    return res
      .status(200)
      .json({ success: true, message: "Friend request declined" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//funciton to cancel the friend request
//endpoint DELETE /api/friendrequest/cancel/:requestID
const cancelFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res
        .status(400)
        .json({ success: false, message: "No request to cancel" });
    }

    if (request.from.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await request.deleteOne();
    return res
      .status(200)
      .json({
        success: true,
        message: "Request successfully canceled",
        request,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//function to get all the pending friendrequests
//endpoint GET /api/friendrequest/getpending
const getPendingRequests = async (req, res) => {
  try {
    const receivedFriendRequests = await FriendRequest.find({
      to: req.userId,
      status: "pending",
    })
      .populate("from", "_id username")
      .select("_id from createdAt");
    const sentFriendRequests = await FriendRequest.find({
      from: req.userId,
      status: "pending",
    })
      .populate("to", "_id username")
      .select("_id to createdAt");

    return res
      .status(200)
      .json({
        success: true,
        message: "FriendRequests fetched",
        sentFriendRequests,
        receivedFriendRequests
      });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  getPendingRequests,
};
