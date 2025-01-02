const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    //ensuring username and passwords are provided
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ success: false, message: 'Username or password required.' })
    }
    //ensuring either email or phoneNo is provided
    if (!req.body.email && !req.body.phoneNo) {
        return res.status(400).json({ success: false, message: 'Email or Phone number required.' })
    }

    //checking for duplicate registers
    //duplicate username:
    let duplicate = await User.findOne({ username: req.body.username }).exec();
    if (duplicate) {
        return res.status(409).json({ success: false, message: 'Username already taken' })
    }

    // duplicate Email:
    if (req.body.email) {
        duplicate = await User.findOne({ email: req.body.email }).exec();
        if (duplicate) {
            return res.status(409).json({ success: false, message: 'Email alredy exists' })
        }
    }

    //duplicate phoneNo:
    if (req.body.phoneNo) {
        duplicate = await User.findOne({ phoneNo: req.body.phoneNo }).exec();
        if (duplicate) {
            return res.status(409).json({ success: false, message: 'Phone number alredy exists' })
        }
    }

    try {
        //hashing password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
        })
        return res.status(201).json({ success: true, message: 'New user registered successfully' })
    } catch (err) {
        //handle validation error(for email and phone number)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: err.message })
        }
        //handle rest of the generic error
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
module.exports = { handleNewUser }