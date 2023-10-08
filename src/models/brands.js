const mongoose = require('mongoose')
const Schema = mongoose.Schema

const brandschema = new Schema({
    brand_name: {
        type: String,
        required:true
    },
    sub_category: {
        type: String,
        required:true
    },
    count:{
        type:Number,
        required:true
    }
})



module.exports = mongoose.model.Brand|| mongoose.model("Brand", brandschema);