const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supplierSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    ban: {
        type:Boolean
    }
}, {timeseries: true})

supplierSchema.statics.isThisEmailUse = async function (email) {
    if(!email) throw new Error('Invalid email')
    try{
        const supplier = await this.findOne({email})
        if(supplier) return true
    
        return false
    }catch (error){
        console.log('error inside isThisEmailUse method ', error.message)
        return true
    }
}

const supplier = mongoose.model('supplier', supplierSchema)
module.exports = supplier