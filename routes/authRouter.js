var express = require('express');
var path = require('path')
var router = express.Router();

const { check,body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var authController = require(path.join(__dirname, '..', 'controllers/authController'))





router.use(function (req, res, next) {
    authController.authControl(req, res, next)
})




router.route('/login')
    .get(function (req, res, next) {
        res.render('pages/authPages/login.ejs')
    })
    .post( [
        check('email', 'Email syntax not valid').isEmail(),
        check('password', 'Password cannot be empty').not().isEmpty()
        ],
        authController.sanitizeLogin,
        authController.onLogin )



router.route('/register')
    .get(function (req, res, next) {
        res.render('pages/authPages/register.ejs')
    })
    .post( [
        check('email', 'Email syntax not valid').isEmail(),
        check('password', 'Password cannot be empty').not().isEmpty()
        ],
        authController.sanitizeRegister,
        authController.onRegister
    )



router.get('/logout', function (req, res, next) {
    console.log('logout')
    req.session.destroy(function (err) {
        res.redirect('/');
    })
});



router.get('/notverified', function (req, res, next) {
    res.render('pages/authPages/notVerified.ejs')
})



router.get('/confirmation', authController.onConfirmationPost)



router.post('/resend', authController.onResendTokenPost)



module.exports = router;