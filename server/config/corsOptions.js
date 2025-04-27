const allowedOrigins = require("./allowedOrigins")

const expressCorsOptions = {
    origin: (origin,callback)=>{
        if(allowedOrigins.includes(origin) || !origin)  //!origin is for development since origin will be undefined
            callback(null,true);
        else callback(new Error('Not allowed by CORS'),false);
    },
    credentials: true,

}

const socketCorsOptions = {
    origin: (origin,callback)=>{
        if(allowedOrigins.includes(origin) || !origin)
            callback(null,true);
        else callback(new Error('Not allowed by CORS'),false);
    },
}

module.exports = {expressCorsOptions,socketCorsOptions};