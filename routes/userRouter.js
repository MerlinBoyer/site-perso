var express = require('express');
var path = require('path')
var router = express.Router();

// validate & parse bodies before calling controllers
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// validate & parse bodies before calling controllers
var userController = require(path.join(__dirname, '..', 'controllers/userController'))
var deviceController = require(path.join(__dirname, '..', 'controllers/deviceController'))





router.use(function (req, res, next) {
	userController.accessChecker(req, res, next)
})




router.get('/', function (req, res, next) {
	res.redirect('/user/dashboard');
});


router.get('/dashboard', function (req, res, next) {
	res.render('pages/userPages/dashboard.ejs')
});


router.get('/device', function (req, res, next) {
	res.render('pages/userPages/device.ejs')
});


router.get('/alerts', function (req, res, next) {
	res.render('pages/userPages/alerts.ejs')
});


router.get('/account', function (req, res, next) {
	res.render('pages/userPages/account.ejs')
});


router.post('/setFriend',[
		check('friendEmail', 'Email syntax not valid').isEmail()
	],
	userController.sanitizeFriend,
	userController.setFriend
)

router.post('/setDevice',[
		check('deviceId', 'device id should not be null').not().isEmpty()
	],
 	userController.sanitizeDevice,
	userController.setDevice
)


module.exports = router;