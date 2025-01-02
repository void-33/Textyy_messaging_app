const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleNewToken = async (req, res) => {
    if (!req.cookies?.jwt) { return res.sendStatus(401); } //Unauthorized
    const refreshToken = req.cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) { return res.sendStatus(403); } //forbidden

    try {
        const decoded = jwt.verify(foundUser.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (decoded.username !== foundUser.username) { return res.sendStatus(403); }

        const accessToken = jwt.sign({ username: decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
            
        return res.status(200).json({ accessToken });
    } catch (err) {
        return res.sendStatus(403);
    }
}

module.exports = { handleNewToken };