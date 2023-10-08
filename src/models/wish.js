const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Wishschema = new Schema({
    user_id: {
        type: String,
    },
    product_id: {
        type: String,
    },

})

Wishschema.statics.exists = async function (product_id, user_id) {
    if (!product_id) throw new Error('Invalid product_id')
    try {
        const product = await this.findOne({ product_id: product_id, user_id: user_id })
        if (product) return true

        return false
    } catch (error) {
        console.log('error inside exists method ', error.message)
        return true
    }
}


module.exports = mongoose.model.Wish|| mongoose.model("Wish", Wishschema);