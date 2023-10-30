const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    gender:{
        type:String,
        enum:["Male","Female"]
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
    }],
    ban: {
        type: Boolean
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timeseries: true })

userSchema.statics.isThisEmailUse = async function (email) {
    if (!email) throw new Error('Invalid email')
    try {
        const user = await this.findOne({ email })
        if (user) return true
        return false
    } catch (error) {
        console.log('error inside isThisEmailUse method ', error.message)
        return false
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User