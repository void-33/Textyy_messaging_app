const allowedOrigins = require("./allowedOrigins")

const corsOptions = {
    origin: (origin,callback)=>{
        if(allowedOrigins.indexOf(origin)!==-1 || !origin)  //!origin is for development since origin will be undefined
            callback(null,true);
        else callback(new Error('Not allowes by CORS'),false);
    }
}

module.exports = corsOptions;