const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    supplier: {
      type: String,
    },
    category: {
      type:mongoose.Types.ObjectId,
      ref:'MainCategory',
    },
    subCategory: {
      type:mongoose.Types.ObjectId,
      ref:'SubCategory',
      // index: true,
    },
    first_visit: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
    },
    price_before: {
      type: Number,
      default: 0,
    },
    price_after: {
      type: Number,
      default: 0,
    },
    images: {
      type:Array,
      required:true,
      public_id:String,
      secure_url:String
    },
    desc: {
      type: Object,
    },
    description: {
      type: String,
      required: true,
    },
    view: {
      type: Boolean,
    },
    quantity: {
      type: Object,
      default: {
        OS: 0,
      },
    },
    dressing: {
      type: Boolean,
    },
    gender: {
      type: String,
    },
    vrpos: {
      type: String,
    },
    vrpossec: {
      type: String,
    },
    garment_id: {
      type: String,
    },
    linked_products: [
      String
    ],
    color: {
      type: String,
      required: true,
    },
  
    brand: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const Product = mongoose.model("product", productSchema);
module.exports = Product;
