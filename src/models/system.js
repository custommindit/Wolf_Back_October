const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const systemSchema = new Schema({
  shipping_fees: Number,
  shipping_duration: Number,
});

const System = mongoose.model("system", systemSchema);
module.exports = System;
