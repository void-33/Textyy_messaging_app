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

module.exports = { getbyUsername }