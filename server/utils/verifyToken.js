const jwt = require('jsonwebtoken');

const verifyToken=(token,secret)=>{
    jwt.verify(token, process.env.secret,(err,decoded)=>{
        if(err) return null;
        return decoded;
    })
    
}

module.exports = verifyToken;