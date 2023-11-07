const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AdminScheema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    role:{
        type:String,
        required:true
    }
})

    const Admin = mongoose.model('admin', AdminScheema)
module.exports = Admin