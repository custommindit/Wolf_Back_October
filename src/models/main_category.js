const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MainCategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    view: {
      type: Boolean,
    },
    products: [{ type: mongoose.Types.ObjectId, ref: "product" }],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model.MainCategory ||
  mongoose.model("MainCategory", MainCategorySchema);
