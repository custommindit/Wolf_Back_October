const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Productschema = new Schema(
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
    typeOfProduct: {
      type: String,
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
      unique: true,
    },
    price_before: {
      type: Number,
      default: 0,
    },
    price_after: {
      type: Number,
      default: 0,
    },
    imageSrc: {
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
    brand: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.model.Product || mongoose.model("Product", Productschema);
