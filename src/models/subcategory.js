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
      public_id: String,
      secure_url: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model.SubCategory ||
  mongoose.model("SubCategory", SubCategorySchema);
