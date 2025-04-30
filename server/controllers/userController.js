const User = require('../models/userModel');

//function to get User ObjectId based on username
//endpoint /api/user/getbyusername
const getbyUsername = async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username required' });
    }
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
        return res.status(400).json({ success: false, message: 'Username doesnot exists' });
    }

    return res.status(200).json({ success: true, message: 'User found', id: foundUser._id })
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

module.exports = { getbyUsername, getFriends }