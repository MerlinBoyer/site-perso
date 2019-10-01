// server.js

const path      = require('path');
const express   = require('express');
const server    = express();
var session     = require('express-session')
const createError = require('http-errors');
var logger      = require('morgan');
const ejs       = require('ejs');
const compression = require('compression')
const crypto    = require('crypto')
const uuid      = require('uuid')

// routers
const indexRouter   = require(path.join(__dirname, '..', '/routes/indexRouter'))
const userRouter    = require(path.join(__dirname, '..', '/routes/userRouter'))
const deviceRouter  = require(path.join(__dirname, '..', '/routes/deviceRouter'))
const authRouter    = require(path.join(__dirname, '..', '/routes/authRouter'))


// primary middlewares
server.use(express.static(path.join(__dirname, '..', '/public')));
server.set('views', path.join(__dirname, '..', '/public/views'));
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


// custom middlewares
const midUserSession    = require(path.join(__dirname, '..', '/middlewares/midUserSession'))
const midFlash          = require(path.join(__dirname, '..', '/middlewares/midFlash'))


var sendgridApiKey = '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'

/*
*  Sessions
*    TODO : en production, necessitera un magasin de sessions
*       https://expressjs.com/fr/advanced/best-practice-security.html
*/
var sess = {
    genid: function(req) {
        return crypto.createHash('sha256')
                .update(uuid.v1())
                .update(crypto.randomBytes(256))
                .digest("hex"); // use UUIDs for session IDs
    },
    secret: 's3Cur3',
    key: 'user_sid',
    name : 'sessionId',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 600000,
    }
}

if (server.get('env') === 'production') {
    console.log('PRODUCTION_ENV  :  enable securised session management')
    server.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true    // serve secure cookies
}

// initSession if doesn't exist already

server.use(session(sess))
server.use(midUserSession)  // add define session.user
server.use(midFlash)        // add req.flash func

// server.use((req,res,next) => {
//     console.log(req.session)
//     next()
// })


/*
*  Views engine
*/
server.set('view engine', 'ejs');
server.set('view options', {
    layout: false
});



/*
*  Errors
*/
// server.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     console.log(err.message)

//     // render the error page
//     res.status(err.status || 500);
//     res.render('partials/error');
// });




/*
*  Routes & controllers
*/
server.use('/',       indexRouter);
server.use('/user',   userRouter);
server.use('/device', deviceRouter);
server.use('/auth',   authRouter);



/*
*  Optimizations
*/
server.use(compression()); //Compress all routes


/*
*   Launch
*/
server.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running on port', process.env.PORT || 4000);
});


module.exports = server;