const Product = require("../models/product");
const Rating = require("../models/rating");
const Brand = require("../models/brands.js")
const Color = require("../models/colors.js")
const mongoose = require("mongoose");

module.exports.getProductById = (req, res, next) => {
  try {
    Product.findById(req.parmas.id).then(product => {
      Rating.find({ product_id: req.parmas.id }).then(async(rate) => {
        const linked_products = await Product.find({_id: {$in: product.linked_products}});
        return res.json({
          status: true,
          product: product,
          rate: rate,
          linked_products: linked_products
        })
      })
    })
  } catch (error) {
    console.log(error.message)
    return res.json({
      status: false,
      message: "Error"
    })
  }
}


module.exports.getProductsBySupCategory = (req, res, next) => {
  try {
    Product.find({subCategory: req.parmas.id}).then(products => {
      return res.json({
        status: true,
        products: products,
      })
    })
  } catch (error) {
    console.log(error.message)
    return res.json({
      status: false,
      message: "Error"
    })
  }
}