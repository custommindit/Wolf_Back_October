const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    supplier: {
      type: String,
    },
    category_id: {
      type: String,
    },
    subCategory: {
      type: String,
      index: true,
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
      type: Array,
      default: [],
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
    size: {
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
