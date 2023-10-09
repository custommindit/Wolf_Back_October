const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    user_id: {
        type: String
    },
    type: {
        type: String
    },
    city: {
        type: String
    },
    area: {
        type: String
    },
    address: {
        type: String
    },
    house_no: {
        type: String
    },
}, {timeseries: true})

const Address = mongoose.model('Address', addressSchema)
module.exports = Address