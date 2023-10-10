const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sizeschema = new Schema({
    size_name: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },

})

const Size = mongoose.model("size", sizeschema);
module.exports = Size;