const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    telephone: {
        type: String
    },
    viewed: [{
        type: String
      }]
}, {timeseries: true})

userSchema.statics.isThisEmailUsed = async function (email) {
    if(!email) throw new Error('Invalid email')
    try{
        const user = await this.findOne({email})
        if(user) return true
        return false
    }catch (error){
        console.log('error inside isThisEmailUsed method ', error.message)
        return false
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User