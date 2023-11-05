const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    description: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: "MainCategory",
    },
    view: {
      type: Boolean,
    },
    Image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model.SubCategory ||
  mongoose.model("SubCategory", SubCategorySchema);
