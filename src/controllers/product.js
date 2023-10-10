const Product = require("../models/product");
const Rating = require("../models/rating");
const Brand = require("../models/brands.js");
const Color = require("../models/colors.js");
const Size = require("../models/size.js");
const mongoose = require("mongoose");
const { MakeRequest, getmodels, requesttryon } = require("./vrRoom.js");

module.exports.getProductById = (req, res, next) => {
  try {
    Product.findById(req.parmas.id).then((product) => {
      Rating.find({ product_id: req.parmas.id }).then(async (rate) => {
        const linked_products = await Product.find({
          _id: { $in: product.linked_products },
        });
        return res.json({
          status: true,
          product: product,
          rate: rate,
          linked_products: linked_products,
        });
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: false,
      message: "Error",
    });
  }
};

module.exports.getProductsBySupCategory = (req, res, next) => {
  try {
    Product.find({ subCategory: req.parmas.id }).then((products) => {
      return res.json({
        status: true,
        products: products,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: false,
      message: "Error",
    });
  }
};

module.exports.uplodaImage = async (req, res, next) => {
  if (!req.files || req.files.length ===0) {
    return res.status(400).send("No file uploaded");
  }
  let images = [];

  for (var i = 0; i < req.files.length; i++) {
    images.push(`${req.files[i].path}`);
  }

  const body = req.body;
  let quantity = JSON.parse(body.quantity);
  const sizes = Object.keys(quantity);

  body.supplier = "Wolf";
  body.imageSrc = images;
  var vrprop = {};
  if (body.dressing) {
    vrprop.gender = body.gender;
    vrprop.vrpos = body.vrpos;
    vrprop.garment_img_url = images[1];
    if (body.vrpos === "bottoms") {
      vrprop.vrpossec = body.vrpossec;
    }
  }
  const product = new Product({
    supplier: "Wolf",
    category_id: body.category_id,
    subCategory: body.subCategory,
    typeOfProduct: body.typeOfProduct,
    first_visit: false,
    name: body.name,
    dressing: body.dressing,
    ...vrprop,
    color: body.color,
    brand: body.brand,
    SKU: body.SKU,
    price_before: body.price_before,
    price_after: body.price_after,
    imageSrc: images,
    desc: JSON.parse(body.desc),
    description: body.description,
    quantity: JSON.parse(body.quantity),
    view: true,
  });

  try {
    const response = await product.save();
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const found = await Size.findOne({
        size_name: size,
        sub_category: response.subCategory,
      });
      if (found === null) {
        const newsize = new Size({
          size_name: size,
          sub_category: response.subCategory,
        });
        newsize.save();
      }
    }
    const found_color = await Color.findOne({
      color_name: body.color,
      sub_category: response.subCategory,
      color_hex: body.color_hex,
    });
    if (found_color === null) {
      const newcolor = new Color({
        color_name: body.color,
        sub_category: response.subCategory,
        color_hex: body.color_hex,
      });
      newcolor.save();
    }
    const found_brand = await Brand.findOne({
      brand_name: body.brand,
      sub_category: response.subCategory,
    });
    if (found_brand === null) {
      const newbrand = new Brand({
        brand_name: body.brand,
        sub_category: response.subCategory,
        image: body.brandImage,
      });
      newbrand.save();
    }
    if (response.dressing) {
      try {
        const responseData = await MakeRequest(vrprop, response.imageSrc[0]);
        console.log("MakeRequest Response:", responseData);

        if (JSON.parse(responseData).success) {
          const updatedProduct = await Product.findOneAndUpdate(
            { _id: response._id },
            { garment_id: JSON.parse(responseData).garment_id },
            { new: true }
          );

          console.log("Updated Product:", updatedProduct);

          return res.json({
            response: updatedProduct,
          });
        }
      } catch (error) {
        console.error("MakeRequest Error:", error);
      }
    }
    return res.json({
      response,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};
