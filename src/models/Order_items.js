const mongoose = require('mongoose')
const Schema = mongoose.Schema

const order_items_Schema = new Schema({
    user_id :{
        type:String,
    },
    email:{
        type:String
    },
    products:[
        {
            product_id: {
                type: String
            },
            name: {
                type: String
            },
            image: {
                type: String
            },
            price: {
                type: Number
            },
            SKU:{type:String},
            quantity: {
                type: String
            },
            color: {
                type: String
            },
            size: {
                type: String
            },
        }
    ],
    phone: {
        type: String,
    },
    country: {
        type: String,
    },
    name: {
        type: String,
    },
    area: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    housenumber: {
        type: String,
    },
    payment: {
        type: String
    },
    totalPrice: {
        type: String
    },
  /*  status:{
        type:String
    },///processing,shipping/completed
    moved to status per supplier
    */
    suppliers:
    [{
        supplier:String,
        status:String
    }],
    returnrequest:
    {type:String}/// none,requested , accepted , denied
},{timestamps:true})

const Order_items = mongoose.model("Order_items", order_items_Schema);
module.exports = Order_items;