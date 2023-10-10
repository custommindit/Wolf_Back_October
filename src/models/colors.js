const mongoose = require('mongoose')
const Schema = mongoose.Schema
function validateColorHexLength(value) {
    return value.length === 6; 
  }
const Colorschema = new Schema({
    color_name: {
        type: String,
        required:true
    },
    sub_category: {
        type: String,
        required:true
    },
    color_hex:{
            type: String,
            required:true,
            validate: [validateColorHexLength, 'Color hex must be exactly 6 characters long'],
    }
})



const Color = mongoose.model("Color", Colorschema);
module.exports = Color;