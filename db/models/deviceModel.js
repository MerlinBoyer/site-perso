'use strict';
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

const deviceSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    deviceId: { type: String, required: true },
});

var deviceModel = mongoose.model("deviceModel",deviceSchema);
// Compile model from schema
module.exports = deviceModel