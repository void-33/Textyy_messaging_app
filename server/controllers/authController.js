const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    //ensuring email or number and password are provided
    if ((!req.body.email && !req.body.phoneNo) || !req.body.password) {
        return res.status(400).json({ success: false, message: "Complete credentials required" });
    }
    let foundUser;
    if (req.body.email) { foundUser = await User.findOne({ email: req.body.email }).exec(); }
    if (req.body.phoneNo) { foundUser = await User.findOne({ phoneNo: req.body.phoneNo }).exec(); }

    //if no user is found  
    if (!foundUser) {
        return res.status(201).json({ success: false, message: "User doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, foundUser.password);
    if (passwordMatch) {
        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        //saving refreshToken in current user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('jwt', refreshToken,
            {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            }
        )

        return res.status(200).json({ success: true, message: "Successfully logged in", accessToken });
    } else {
        return res.status(401).json({ success: false, message: "Enter valid credentials" })
    }
}

module.exports = { handleLogin };