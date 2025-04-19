const jwt = require('jsonwebtoken');

const verifyJwt = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startswith('Bearer')) res.sendStatus(401) //unauthorized
    const token = authHeader.split(" ")[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err) res.sendStatus(403); //invalid token
        req.user = decoded.username;
    });
    next();
}

module.exports = verifyJwt;