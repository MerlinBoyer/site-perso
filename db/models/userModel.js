'use strict';
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

// var userSchema = new Schema({
//   login: { type: String, required: true},
//   password: { type: String, required: true }
// });

	
var userSchema = new Schema({
  name: String,
  login: { type: String},
  email: { type: String, unique: true, required: true},
  deviceId: { type: String, unique: true},
  friends: [{ email: 'String' }],
  roles: [{ type: 'String' }],
  isVerified: { type: Boolean, default: false },
  isLogged: { type: Boolean, default: false },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date
});


// Virtual for author's full name
userSchema
  .virtual('getlogin')
  .get(function () {
    return this.login;
  });

userSchema
  .virtual('getemail')
  .get(function () {
    return this.email;
  });

userSchema
  .virtual('getpassword')
  .get(function () {
    return this.password;
  });




var userModel = mongoose.model("userModel",userSchema);
// Compile model from schema
module.exports = userModel





/*
var schema = new Schema(
{
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now() },
  age: { type: Number, min: 18, max: 65, required: true },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array: [],
  ofString: [String], // You can also have an array of each of the other types too.
  nested: { stuff: { type: String, lowercase: true, trim: true } }
})
*/