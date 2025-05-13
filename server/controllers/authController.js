const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {sendVerificationEmail} = require('../services/sendEmail');

//fucntion to register new users
// expected req = username, password, email, birthday, firstName, lastName
// /api/auth/register
const handleRegister = async (req, res) => {
  //ensuring username and passwords are provided
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ success: false, message: "Username or password required" });
  }
  //ensuring either email or username is provided
  if (!req.body.email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  //ensuring bithday,firstname and lastname are provided
  if (!req.body.dateOfBirth || !req.body.firstName || !req.body.lastName) {
    return res
      .status(400)
      .json({ success: false, message: "Complete credentials required" });
  }

  //convert birthday string to date
  const dob = new Date(req.body.dateOfBirth);

  //ensuring provided birthday is in correct format
  if (isNaN(dob)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid birthday format" });
  }

  //checking for duplicate registers
  //duplicate username:
  let duplicate = await User.findOne({ username: req.body.username }).exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ success: false, message: "Username already taken" });
  }

  // duplicate Email:
  if (req.body.email) {
    duplicate = await User.findOne({ email: req.body.email }).exec();
    if (duplicate) {
      return res
        .status(409)
        .json({ success: false, message: "Email alredy exists" });
    }
  }

  try {
    //hashing password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: dob,
      emailVerificationToken,
    });

    sendVerificationEmail(newUser.email, emailVerificationToken);
    return res
      .status(201)
      .json({ success: true, message: "New user registered successfully" });
  } catch (err) {
    //handle validation error(for email)
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    //handle rest of the generic error
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//function to handle login
const handleLogin = async (req, res) => {
  //ensuring email or number and password are provided
  if ((!req.body.email && !req.body.username) || !req.body.password) {
    return res
      .status(400)
      .json({ success: false, message: "Complete credentials required" });
  }
  let foundUser;
  if (req.body.email) {
    foundUser = await User.findOne({ email: req.body.email }).exec();
  }
  if (req.body.username) {
    foundUser = await User.findOne({ username: req.body.username }).exec();
  }

  //if no user is found
  if (!foundUser) {
    return res
      .status(404)
      .json({ success: false, message: "User doesn't exist" });
  }

  if(!foundUser.isEmailVerified){
    return res.status(404)
    .json({success:false, message: "Email is not verified"});
    
  }

  const passwordMatch = await bcrypt.compare(
    req.body.password,
    foundUser.password
  );
  if (passwordMatch) {
    const accessToken = jwt.sign(
      {
        username: foundUser.username,
        userId: foundUser._id.toString(),
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
        userId: foundUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    //saving refreshToken in current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const user = {
      userId: foundUser._id,
      username: foundUser.username,
    };

    return res
      .status(200)
      .json({
        success: true,
        message: "Successfully logged in",
        accessToken,
        user,
      });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Enter valid credentials" });
  }
};

//function to handle Logout
//endpoint GET /api/auth/logout
const handleLogout = async (req, res) => {
  // !delete accesstoken on client side

  if (!req.cookies?.jwt) {
    return res.sendStatus(205);
  } //no content
  const refreshToken = req.cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  foundUser.save();

  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json({ success: true, message: "Successfully logged out" });
};

//function to delete account
const handleDeleteAccount = async (req, res) => {
  if (!req.cookies?.jwt) {
    return res.sendStatus(401);
  } //unauthorized
  const refreshToken = req.cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(403); //forbidden
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer")) {
    return res.sendStatus(401);
  } //Unauthorized
  const accessToken = authHeader.split(" ")[1];

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.username !== foundUser.username) {
        return res.sendStatus(403); //forbidden
      }
      await foundUser.deleteOne();
      res.clearCookie("jwt", { httpOnly: true });
      return res
        .status(200)
        .json({ success: true, message: "Successfully deleted you account" });
    } catch (err) {
      return res.sendStatus(403);
    }
  }
};

//function to generate new accessToken
const handleNewAccessToken = async (req, res) => {
  if (!req.cookies?.jwt) {
    return res.sendStatus(401);
  } //Unauthorized
  const refreshToken = req.cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    return res.sendStatus(403);
  } //forbidden

  try {
    const decoded = jwt.verify(
      foundUser.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (decoded.username !== foundUser.username) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: decoded.username, userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    return res
      .status(200)
      .json({
        success: true,
        message: "Accesstoken refreshed",
        accessToken,
        user,
      });
  } catch (err) {
    return res.sendStatus(403);
  }
};

//function to verify accesstoken
const handleAccessTokenVerification = (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer"))
    return res.status(401).json({ success: false, message: "Token misssing" }); //unauthorized
  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Token missing" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    } //invalid token
    const user = {
      userId: decoded.userId,
      username: decoded.username,
    };
    return res
      .status(200)
      .json({ success: true, message: "Token valid", user });
  });
};

// GET /api/auth/verify-email?token=verificationToken
const handleEmailVerification = async (req,res) => {
  const {token} = req.query;
  try{
    const user = await User.findOne({emailVerificationToken:token});

    if(!token) {
      return res.status(400).send('Missing verification Token');
    }

    if(!user) {
      return res.status(400).send('Invalid Token');
    }

    if(user.emailTokenExpiry < Date.now()){
      return res.status(400).send("Token has expired. Please request a new verification email");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken= '';
    user.emailTokenExpiry = null;

    await user.save();

    return res.status(200).send("✅ Email verified successfully! You can now log in.");
  }catch(err){
    return res.status(500).send("Internal server Error");
  }
  
}

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleDeleteAccount,
  handleNewAccessToken,
  handleAccessTokenVerification,
  handleEmailVerification
};
