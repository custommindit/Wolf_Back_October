const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RatingSchema = new Schema({
    product_id: {
        type: String,
    },
    user_id: {
        type: String,
    },
    user_name: {
        type: String
    },
    rate: {
        type: Number
    },
    addres_rate: {
        type: String
    },
    text_rate: {
        type: String
    }
})


const Rating = mongoose.model("rating", RatingSchema);
module.exports = Rating;