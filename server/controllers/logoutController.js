const User = require('../models/userModel');

const handleLogout = async (req, res) => {
    // !delete accesstoken on client side

    if (!req.cookies?.jwt) { return res.sendStatus(205); } //no content
    const refreshToken = req.cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    foundUser.save();

    res.clearCookie('jwt', { httpOnly: true });
    res.status(200).json({ success: true, message: "Successfully logged out" });
};

module.exports = { handleLogout }