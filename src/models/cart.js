const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
    user_id: {
        type: String,
    },
    product_id: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    clothing: {
        type: Boolean
    }

})

CartSchema.statics.isThisCart = async function (product_id, user_id, size, color) {
    if (!product_id) throw new Error('Invalid product_id')
    try {
        const product = await this.findOne({ product_id: product_id, user_id: user_id, size: size, color: color })
        if (product) return false

        return true
    } catch (error) {
        console.log('error inside isThiscart method ', error.message)
        return false
    }
}


module.exports = mongoose.model.Cart || mongoose.model("Cart", CartSchema);