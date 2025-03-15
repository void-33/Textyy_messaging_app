const express = require('express');

const helmet = require('helmet');
const {rateLimit} = require('express-rate-limit');
const cors = require('cors');
const {expressCorsOptions} = require('./config/corsOptions');
const cookieParser = require('cookie-parser');

const limiter = rateLimit({
    limit: 3000,
    windowMs: 60 * 60 * 1000, //1hr
    message: "Too many requests. Please try again after an hour.",
});

const app = express();

//? other middlewares are to be used
app.use(helmet());
app.use(limiter);
app.use(cors(expressCorsOptions));

app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api', require('./routes/index'));

app.all('*',(req,res)=>{
    res.status(404);
    if(req.accepts('json')) res.json({error: '404 not found'});
    else res.send('404 not found');

})


module.exports = app;