/*
*  this section handle raw request, parse and analyze body then call controllers functions
*
*  TODO : 
*    Separate this files in subfiles
*/

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





/* GET users listing. */
router.get('/', function (req, res, next) {
	res.render('pages/index.ejs', {
		user: req.session.user
	});
});





router.get('/about', function (req, res, next) {
	res.render('pages/about.ejs', {
		user: req.session.user
	});
});





module.exports = router;