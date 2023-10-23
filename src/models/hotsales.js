const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HotSaleSchema = new Schema({
    category_id: {
        type: String,
    },
    product_id: {
        type: String,
        unique:true
    },
})


const HotSale = mongoose.model("HotSale", HotSaleSchema);
module.exports = HotSale;