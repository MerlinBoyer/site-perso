'use strict';
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

const friendSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    email: { type: String, required: true },
    phone: { type: String }
});

var friendModel = mongoose.model("friendModel",friendSchema);
// Compile model from schema
module.exports = friendModel