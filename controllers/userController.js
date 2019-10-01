var path = require('path')
const { check,body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var DB = require(path.join(__dirname, '..', 'db/db'))
db = new DB()




// middleware function to check for logged-in users
exports.accessChecker = (req, res, next) => {
    if (!req.session.user.isLogged) {
        res.redirect('/auth/login')
    }
    else if ( !req.session.user.isVerified ) {
        req.session.user.isLogged = false
        res.redirect('/auth/notVerified')
    }
    else {
        next()
    }
}


exports.sanitizeFriend = (req, res, next)=> {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.errors.forEach(err => {
            req.flashError(err.param, err.msg)
        })
        res.redirect('/user/alerts')
    } else {
        next()
    }
}

exports.setFriend = (req, res, next) => {
    let friendEmail = req.body.friendEmail
    let friendPhone = ''
    let email = req.session.user.email
    console.log('set friend email : ', friendEmail, ' to : ', email)

    if(!email || !friendEmail) {
        req.flashError('friendEmail-missing', 'please provide your friend email')
        res.redirect('/user/alerts')
    }
        
    db.findUserByEmail(email, (user) => {

        if(!user) {
            req.flashError('user-unknown', 'user unknown, please log again')
            res.redirect('/auth/login')
        }

        let friend = db.newFriend( user, friendEmail, friendPhone )
        console.log('try to save friend : ', friend)

        db.saveInstance(friend, (err)=> {
            if (err) {
                req.flashError('error-saveinstance-friend', 'c\'ant save friend')
                res.redirect('/user/alerts')
            } else {
                req.flashSuccess('friend-set', 'Friend has been updated')
                res.redirect('/user/alerts')
            }
        })
    })
}



exports.sanitizeDevice = (req, res, next)=> {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.errors.forEach(err => {
            req.flashError(err.param, err.msg)
        })
        res.redirect('/user/device')
    } else {
        next()
    }
}

exports.setDevice = (req, res, next) => {
    console.log(req.session.user.email)
    let deviceId = req.body.deviceId
    let email = req.session.user.email
    console.log('set device id : ', deviceId, ' to : ', email)

    if(!email || !deviceId) {
        req.flashError('deviceId-missing', 'please provide your deviceId')
        res.redirect('/user/device')
    }
        
    db.findUserByEmail(email, (user) => {

        if(!user) {
            req.flashError('user-unknown', 'user unknown, please log again')
            res.redirect('/auth/login')
        }

        let device = db.newDevice( user, deviceId )
        console.log('try to save device : ', device)

        db.saveInstance(device, (err)=> {
            if (err) {
                req.flashError('error-saveinstance-device', 'c\'ant save device Id')
                res.redirect('/user/device')
            } else {
                req.flashSuccess('device-set', 'Device has been updated')
                res.redirect('/user/device')
            }
        })
    })
}
