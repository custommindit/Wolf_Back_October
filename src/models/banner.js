const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
  {
    category: {
      type: mongoose.Types.ObjectId,
      ref: "MainCategory",
    },
    img: {
      secure_url: String,
      public_id: String,
    },
    view: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("banner", bannerSchema);
module.exports = Banner;
