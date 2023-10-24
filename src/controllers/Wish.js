const mongoose = require("mongoose");
const Wish = require("../models/wish");
const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports.Create_wish_item = async (req, res) => {
  const id = req.body.decoded.id;

  const body = req.body

  const isNewWish = await Wish.exists(body.product_id, id, body.size, body.color)
  if (isNewWish) {
    return res.json({
      message: 'This product is already in wishlist'
    })
  }

  const newWish = new Wish({
    user_id: id,
    product_id: body.product_id
  })

  await newWish.save().then(response => {
    console.log(response)
    return res.status(200).json({ response: response })
  }).catch(err => {
    console.log('err', err)
    return res.status(200).json(err)
  })
}

module.exports.Read_wish_items = async (req, res) => {
  const id = req.body.decoded.id;
  await Wish.find({ user_id: id })
    .then((response) => {
      return res.json({
        response: response,
        success: true,
        message: `success ${response.length}`
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
