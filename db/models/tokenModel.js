'use strict';
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userModel' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

var tokenModel = mongoose.model("tokenModel",tokenSchema);
// Compile model from schema
module.exports = tokenModel