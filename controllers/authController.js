const path = require('path')
const crypto = require('crypto')
const uuid = require('uuid')
const { check,body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var DB = require(path.join(__dirname, '..', 'db/db'))
db = new DB()


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//middleware if user already connected
exports.authControl = (req, res, next) => {
    if(req.url == '/logout' || req.url == '/notVerified') {
        next()
    } else if (req.session.user.isLogged) {
        res.redirect('/')
    } else {
        next()
    }
}




// email auth 
// https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb



exports.sanitizeLogin = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.errors.forEach(err => {
            req.flashError(err.param, err.msg)
        })
        res.redirect('/auth/login')
    } else {
        next()
    }
}

exports.sanitizeRegister = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.errors.forEach(err => {
            req.flashError(err.param, err.msg)
        })
        res.redirect('/auth/register')
    } else {
        next()
    }
}


exports.onLogin = (req, res, next) => {

    var email = req.body.email
    var password = req.body.password
    console.log('try to log : ', email, password)

    let user = db.createUser(email, password)
    db.authenticateUser(user, (userResult) => {
        console.log(userResult)
        if (userResult) {
            req.session.user  = userResult
            req.session.user.isLogged = true
            res.redirect('/user/dashboard')
        } else {
            req.flashError('error', 'wrong login credentials')
            res.redirect('/auth/login')
        }
    })
}







sendConfirmationEmail = (req, res, next) => {
    if(!req.session.user.email) {
        req.flashError('email-not-known', 'please provide your email')
        res.redirect('/auth/notVerified')
    }
    email = req.session.user.email
    console.log('start resend token to : ', email)
    
    db.findUserByEmail(email, (user) => {
        if(!user) {
            req.flashError('userunknown', 'email unknown')
            res.redirect('/auth/register')
        }
        let token = db.newToken( user )
        db.saveInstance(token, (err)=> {
            if (err) {
                req.flashError('errorToken', 'c\'ant send validation email')
                res.redirect('/auth/notVerified')
            } else {

                var msg = {
                    to: req.session.user.email,
                    from: 'no-reply@myeli.com',
                    subject: 'please confirm your email',
                    text: 'alarm ?',
                    html: 'Please verify your account by clicking the link: \nhttps:\/\/' + req.headers.host + '\/auth\/confirmation?token=' + token.token + '.\n'
                };

                console.log( 'apikey : ', process.env.SENDGRID_API_KEY )

                sgMail.send(msg)
                    .catch((err) => {
                        console.log('sgmail Error : ', err.response.body)
                    });
                console.log('confirmation email send to : ', msg.to)
                next()
            }
        })
    })
}


exports.onRegister = (req, res) => {
    var email = req.body.email
    var pass = req.body.password
    let user = db.createUser(email, pass)
    db.userExist(user, (result) => {
        if (result) {
            console.log('error user already exist')
            req.flashError('error', 'user already exists')
            res.redirect('/auth/register')
        } else {
            db.saveInstance(user, (err) => {
                if (err) {
                    console.log('onRegister error occured : ', err)
                    req.flashError('error', 'c\'ant save user in db')
                    res.redirect('/auth/register')
                } else {
                    req.session.user.isLogged = true
                    res.redirect('/user/dashboard')
                }
            })
        }
    })
}



exports.onResendTokenPost= (req, res, next) => {

    if(!req.body.email) {
        req.flashError('emailnotknown', 'please provide your email')
        res.redirect('/auth/notVerified')
    }

    req.session.user.email = req.body.email
    sendConfirmationEmail(req, res, next)

    res.redirect('/auth/login')
}


exports.onConfirmationPost= (req, res) => {
    
    var token = req.param('token')

    if(!token) {
        req.flashError('token_expired', 'token has expired please resend confirmation email')
        res.redirect('/auth/notVerified')
    }


    console.log('confirm token : ', token)

    db.confirmEmail(token, (userResult) => {
        if(!userResult) {
            req.flashError('email-validation-not-valid', 'your email verification has expired please try again')
            res.redirect('/auth/notVerified')
        } else {
            req.session.user = userResult
            req.session.user.isLogged = true
            res.redirect('/user/dashboard')
        }
    })
}