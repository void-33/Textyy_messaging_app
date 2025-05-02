const User = require('../models/userModel');

//function to get User ObjectId based on username
//endpoint /api/user/getidbyusername/:username
const getIdbyUsername = async (req, res) => {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username required' });
    }
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
        return res.status(400).json({ success: false, message: 'Username doesnot exists' });
    }

    return res.status(200).json({ success: true, message: 'User found', userId: foundUser._id })
}

//fucntion to get list of friends of the user
//endpoint GET /api/user/getfriends
const getFriends = async(req,res)=>{
    const userId = req.userId;
    try{
        const foundUser = await User.findById(userId).populate("friends","username _id");

        if(!foundUser){
            return res.status(400).json({success:false, message:"User not found"});
        }

        const friends = foundUser.friends;

        return res.status(200).json({success:true, message:"Successfully fetched friend list",friends})

    }catch(err){
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

//function to get users based on their usename search query
//endpoint GET /api/user/serach?query=someName
const searchUsers = async (req,res) =>{
    const query = req.query.query?.trim();
    
    if(!query){
        return res.status(400).json({success:false, message:"Query is required"});
    }

    try {
        const users = await User.find({
            username: {$regex: query, $options: 'i'},
            _id: {$ne: req.userId},
        }).select("_id username").limit(10);

        return res.status(200).json({success:true, message: "Succesfully fetched Users",users});
    } catch (err) {
        return res.status(500).json({success:false, message: 'Internal Server Error'});
    }
}


//endpoint DELETE /api/user/unfriend/:otherUserId
const unfriendUser = async(req,res)=>{
    const {otherUserId}=req.params;    
    if(!otherUserId){
        return res.status(400).json({ success: false, message: "Missing userId"});
    }
    try{
        await User.findByIdAndUpdate(req.userId, { $pull: { friends: otherUserId } });
        await User.findByIdAndUpdate(otherUserId, { $pull: { friends: req.userId } });

        return res.status(200).json({ success: true, message: "Unfriended successfully" });
    }catch(err){
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = { getIdbyUsername, getFriends, searchUsers , unfriendUser};