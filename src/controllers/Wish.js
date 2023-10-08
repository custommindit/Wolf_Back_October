const mongoose = require("mongoose");
const Wish = require("../models/wish");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.Create_wish_item = async (req, res) => {
  const body = req.body;
  const id = body.decoded.id;

  const isNewCart = await Wish.exists(body.product_id, id);
  if (!isNewCart) {
    return res.json({
        message: "This product is already in wishlist",
        success: false,
      });
  }
  await add_wish_item(body.product_id, id)
    .then((response) => {
      return res.json({ response, success: true, message: "Added to wishlist" });
    })
    .catch((err) => {
      return res.json({
        message: "ERROR",
        success: false,
      });
    });
};

const add_wish_item = async ( product_id , id) => {
  const newCart_item = new Wish({
    user_id: id,
    product_id:product_id,
  });
  await newCart_item.save();
  return newCart_item;
};


module.exports.Read_wish_items = async (req, res) => {
  const id = req.body.decoded.id;
  await Wish.find({ user_id: id })
    .then((response) => {
      return res.json({
        response: response,
        success:true,
        message:`success ${response.length}`
      });
    })
    .catch((err) => {
        return res.json({
            message: "ERROR",
            success: false,
          });
    });
};

module.exports.Delete_wish_item = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const oi = await Wish.findById(_id);
  if (!oi) {
    return res.json({
        message: "This wish didn't even exist",
        success: false,
      });
  }
  await Wish.findByIdAndDelete(_id)
    .then((e) => {
      return res.json({
        message: "Deleted",
        success: true,
      });
    })
    .catch((err) => {
      return res.json({
        message: "ERROR",
        success: false,
      });
    });
};


module.exports.Delete_by_product = async (req, res) => {
  const product_id = req.params.id;
  const user = req.body.decoded.id;
  await Wish.deleteOne({ user_id: user, product_id: product_id })
    .then((e) => {
        return res.json({
            message: "Deleted",
            success: true,
          });
    })
    .catch((err) => {
        return res.json({
            message: "ERROR",
            success: false,
          });
    });
};
