const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleDeleteAccount = async (req, res) => {
    if (!req.cookies?.jwt) { return res.sendStatus(401) } //unauthorized
    const refreshToken = req.cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(403); //forbidden
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer')) { return res.sendStatus(401) } //Unauthorized
    const accessToken = authHeader.split(' ')[1];

    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
            if (decoded.username !== foundUser.username) {
                return res.sendStatus(403); //forbidden
            }
            await foundUser.deleteOne();
            res.clearCookie('jwt', { httpOnly: true });
            return res.status(200).json({ success: true, message: "Successfully deleted you account" });
        } catch (err) {
            console.log(err.message);
            return res.sendStatus(403);
        }
    }
}

module.exports = { handleDeleteAccount };