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
    scope:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        deafult:Date.now
    },
    contestList: []
})

module.exports = mongoose.model('User',UserSchema);