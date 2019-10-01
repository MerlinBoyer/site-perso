var express = require('express');
var path = require('path')
var router = express.Router();

// validate & parse bodies before calling controllers
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// validate & parse bodies before calling controllers
var userController   = require(path.join(__dirname, '..', 'controllers/userController'))
var deviceController = require(path.join(__dirname, '..', 'controllers/deviceController'))


last_alarm = {}

/* GET users listing. */
router.post('/testalarm', deviceController.testAlarm )


router.post('/alarm', function(req, res, next) {
  console.log('BIJOU ALERT')
  console.log(req.body)
  last_alarm = req.body
  deviceController.sendMail(req, res, () => {
    next()
  });
});

module.exports = router;