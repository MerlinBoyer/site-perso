"use strict";

const mongoose = require('mongoose');

var username = 'myeliadmin'
var password = 'nlAm8fW7WG4k5cJs'
var urimongoDB = "mongodb+srv://" + username + ":" + password + "@myelicluster-nmyoq.gcp.mongodb.net/test?retryWrites=true&w=majority"


const crypto = require('crypto')


var async = require('async')
var deviceModel = require('./models/deviceModel')
var userModel = require('./models/userModel')
var friendModel = require('./models/friendModel')
var tokenModel = require('./models/tokenModel')


//Set up mongoose connection
mongoose.connect(urimongoDB, { useNewUrlParser: true });





var users = []
var devices = []
var friends = []


class db {

    constructor() {
        this.dbConnection = mongoose.connection;
        this.dbConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }

    createUser(email, password) {
        var userdetail = {
            email: email,
            password: password,
        }
        return new userModel(userdetail);
    }

    saveInstance(instance, cb) {
        instance.save(function (err) {
            if (err) {
                console.log('saveinstance err : ', err)
            }
            cb(err)
        });
    }

    // check if user is in DB,
    // return true or false if 
    userExist(user, cb) {
        userModel
            .findOne({
                email: user.getemail,
            }, function (err, userResult) {
                if (err) console.log('err db userExist:', err)
                cb(userResult)
            })
    }

    // check if user authentication is right
    authenticateUser(user, cb) {
        // console.log(user.getemail)
        userModel
            .findOne({
                email: user.getemail,
                password: user.getpassword
            }, function (err, userResult) {
                if (err) console.log('err db authUser:', err)
                cb(userResult)
            })
    }
    

    newToken(user) {
        return new tokenModel({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    }

    newFriend(user, email, phone) {
        return new friendModel({ _userId: user._id, email: email, phone: phone });
    }

    newDevice(user, deviceId) {
        return new deviceModel({ _userId: user._id, deviceId: deviceId });
    }


    findUserByEmail(email, cb) {
        userModel
            .findOne({
                email: email,
            }, function (err, userResult) {
                if (err) console.log('err db finduserbyemail:', err)
                cb(userResult)
            })
    }

    findUserByDeviceId(deviceId, cb){
        if(!deviceId){
            cb(undefined)
        } else {
            deviceModel.findOne({ deviceId: deviceId }, function (err, device) {
                if(!device) {
                    cb(undefined)
                } else {
                    userModel.findOne({ _id: device._userId}, function (err, user) {
                        if(!user) {
                            console.log('cannot find user corresponding to device in db')
                            cb (undefined)
                        } else {
                            cb(user)
                        }
                    })
                }
            })
        }
    }

    findFriendByUser(user, cb){
        if(!user) {
            cb(undefined)
        } else {
            friendModel.findOne( { _userId: user._id }, function (err, friend) {
                if(!friend) {
                    console.log('cannot find friend corresponding to user in db')
                    cb (undefined)
                } else {
                    cb(friend)
                }
            })
        }
    }


    confirmEmail(token, cb){
        tokenModel.findOne({ token: token }, function (err, token) {
            if (!token) {
                console.log('cannot find token in db')
                cb(undefined)
            }

            userModel.findOne({ _id: token._userId}, function (err, user) {
                if(!user) {
                    console.log('cannot find user corresponding to token in db')
                    cb (undefined)
                }

                user.isVerified = true;
                user.save(function (err) {
                    if (err) {
                        cb (undefined)
                    } else {
                        cb( user )
                    }
                })
            })
        })
    }


    alarmRelay(deviceId, cb){
        // userModel.findOne({ deviceId: deviceId }, function (err, user) {
        //     if (!token) {
        //         console.log('cannot find token in db')
        //         cb(undefined)
        //     }

        //     userModel.findOne({ _id: token._userId}, function (err, user) {
        //         if(!user) {
        //             console.log('cannot find user corresponding to token in db')
        //             cb (undefined)
        //         }

        //         user.isVerified = true;
        //         user.save(function (err) {
        //             if (err) {
        //                 cb (undefined)
        //             } else {
        //                 cb( user )
        //             }
        //         })
        //     })
        // })
    }



}



module.exports = db