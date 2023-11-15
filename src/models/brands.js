const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Brandschema = new Schema({
  brand_name: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Brand = mongoose.model("Brand", Brandschema);
module.exports = Brand;
