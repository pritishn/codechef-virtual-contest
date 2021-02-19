const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    accessToken:{
        type:String,
        required:true
    },
    scope:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        deafult:Date.now
    }
})

module.exports = mongoose.model('User',UserSchema);