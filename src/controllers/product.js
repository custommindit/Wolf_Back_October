const Product = require("../models/product");
const Rating = require("../models/rating");
const Brand = require("../models/brands.js");
const Color = require("../models/colors.js");
const Size = require("../models/size.js");
const HotSale = require("../models/hotsales");
const mongoose = require("mongoose");
const { MakeRequest, getmodels, requesttryon } = require("./vrRoom.js");
var cloudinary = require("../utils/cloudinary.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports.getProductById = (req, res, next) => {
  try {
    if (req.params.id === "undefined" || req.params.id.length !== 24) {
      return res.status(404).json({
        status: false,
        message: "No such product",
      });
    } else {
      Product.findById(req.params.id).then((product) => {
        Rating.find({ product_id: req.params.id }).then(async (rates) => {
          const linked_products = await Product.find({
            _id: { $in: product.linked_products },
          });
          let total = 0;
          let totalRate = 0;
          if (rates.length > 0) {
            rates.forEach((rate) => {
              total = total + rate.rate;
            });
            totalRate = total / rates.length;
          }
          return res.json({
            status: true,
            product: product,
            rates: rates,
            totalRate: totalRate,
            linked_products: linked_products,
          });
        });
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: false,
      message: "Error",
    });
  }
};

module.exports.getProducts = (req, res, next) => {
  Product.find({})
    .populate({
      path: "category",
    })
    .populate({
      path: "subCategory",
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getProductsBySupCategory = (req, res, next) => {
  try {
    Product.find({ subCategory: req.parmas.id, view: true }).then(
      (products) => {
        return res.json({
          status: true,
          products: products,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: false,
      message: "Error",
    });
  }
};

module.exports.uplodaImage = async (req, res, next) => {
  let images = [];
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No file uploaded");
  }
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
    category: body.category,
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

module.exports.uplodaImageCloud = async (req, res, next) => {
  let images = [];
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No file uploaded");
  }
  for (var i = 0; i < req.files.length; i++) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files[i].path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/product/images` }
    );
    images.push({ secure_url, public_id });
  }
  const body = req.body;
  let quantity = JSON.parse(body.quantity);
  const sizes = Object.keys(quantity);

  body.supplier = "Wolf";
  // body.images = images;
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
    category: body.category,
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
    images: images,
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

module.exports.models = async (req, res) => {
  await getmodels(req.body.gender)
    .then((response) => {
      res.json({
        default: JSON.parse(response).models[0],
        image: JSON.parse(response).model_files[0],
        response: JSON.parse(response),
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
        error: error.message,
      });
    });
};

module.exports.tryon = async (req, res) => {
  await requesttryon(req.body.garments, req.body.gender)
    .then((response) => {
      return res.json({ tryon: JSON.parse(response) });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
        error: error.message,
      });
    });
};

module.exports.getProductByMainCategory = async (req, res) => {
  let _id = req.params.id;
  await Product.find({ category_id: _id })
    .then((e) => {
      return res.json({
        response: e,
      });
    })
    .catch((err) => {
      return res.json({ message: err.message });
    });
};

module.exports.getProductFirstVisit = async (req, res) => {
  let _id = req.params.id;
  await Product.find({ category_id: _id, first_visit: true })
    .then((e) => {
      return res.json({
        response: e,
      });
    })
    .catch((err) => {
      return res.json({ message: err.message });
    });
};

module.exports.UpdateFirstVisitProduct = async (req, res) => {
  const body = req.body;
  let _id = new mongoose.Types.ObjectId(req.params.id);
  await Product.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      return res.json({ message: "Error" });
    });
};
module.exports.recomm = (req, res) => {
  Product.aggregate([
    { $match: { view: true, category_id: req.body.category_id } },
    { $sample: { size: 8 } },
  ])
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

module.exports.SearchByName = (req, res) => {
  Product.find({
    name: { $regex: ".*" + req.body.query + ".*", $options: "i" },
    view: true,
  })
    .limit(8)
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};
module.exports.SearchByNameBulk = (req, res) => {
  Product.find({
    name: { $regex: ".*" + req.body.query + ".*", $options: "i" },
    view: true,
  })
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

module.exports.cart = async (req, res) => {
  try {
    const ids = req.body.products;
    const products = [];
    for (var i = 0; i < ids.length; i++) {
      await Product.findById(ids[i])
        .then((response) => {
          products.push(response);
        })
        .catch((error) => {
          res.json({
            message: "An error Occured!",
          });
        });
    }
    if (products.length === ids.length) {
      let rates1 = [];
      for (var i = 0; i < products.length; i++) {
        await Rating.find({ product_id: products[i]._id }).then(
          async (rates) => {
            let total = 0;
            let totalRate = 0;
            if (rates.length > 0) {
              rates.forEach((rate) => {
                total = total + rate.rate;
              });
              totalRate = total / rates.length;
            }
            rates1.push(totalRate);
          }
        );
      }

      res.json({ response: products, rates: rates1 });
    }
  } catch (error) {
    res.json({ response: [] });
  }
};

module.exports.getProductBySubCategory2 = async (req, res) => {
  let _id = req.params.id;
  const perPage = 12;
  const query = {
    subCategory: _id,
    view: true,
  };

  const options = {
    skip: (req.params.page - 1) * perPage,
    limit: perPage,
  };
  await Product.find(query, null, options)
    .then(async (e) => {
      let rates1 = [];
      for (var i = 0; i < e.length; i++) {
        await Rating.find({ product_id: e[i]._id }).then(async (rates) => {
          let total = 0;
          let totalRate = 0;
          if (rates.length > 0) {
            rates.forEach((rate) => {
              total = total + rate.rate;
            });
            totalRate = total / rates.length;
          }
          rates1.push(totalRate);
        });
      }
      const count = await Product.count(query);
      return res.json({
        response: e,
        rates: rates1,
        count: count,
      });
    })
    .catch((err) => {
      return res.json({ message: err.message });
    });
};
module.exports.UpdateViewProduct = async (req, res) => {
  const body = req.body;
  let _id = new mongoose.Types.ObjectId(req.params.id);
  await Product.findOneAndUpdate({ _id: _id }, { $set: body }, { new: true })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      return res.json({ message: "Error" });
    });
};

module.exports.DeleteProduct = async (req, res) => {
  let _id = new mongoose.Types.ObjectId(req.params.id);
  await Cart.find({ product_id: _id }).then(async (carts) => {
    for (var i = 0; i < carts.length; i++) {
      await Cart.deleteMany({ product_id: carts[i].product_id });
    }
  });

  await Wish.find({ product_id: _id }).then(async (wishs) => {
    for (var i = 0; i < wishs.length; i++) {
      await Wish.deleteMany({ product_id: wishs[i].product_id });
    }
  });

  await Product.deleteOne({ _id: _id })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      return res.json({ message: "Error" });
    });
};

module.exports.getHomeRecents = async (req, res) => {
  try {
    let id = req.params.id;
    ////in accordance to type change
    const newid = new mongoose.Types.ObjectId(id);
    Product.find({ category_id: newid })
      .sort({ _id: -1 })
      .limit(4)
      .then(async (documents) => {
        let rates1 = [];
        for (var i = 0; i < documents.length; i++) {
          await Rating.find({ product_id: documents[i]._id }).then(
            async (rates) => {
              let total = 0;
              let totalRate = 0;
              if (rates.length > 0) {
                rates.forEach((rate) => {
                  total = total + rate.rate;
                });
                totalRate = total / rates.length;
              }
              rates1.push(totalRate);
            }
          );
        }
        return await res.json({
          response: documents,
          rates: rates1,
        });
      });
  } catch (error) {
    res.json({ response: [] });
  }
};

module.exports.gethomesublist = async (req, res) => {
  try {
    let id = req.params.id;
    if (id.length === 24)
      Product.find({ subCategory: id })
        .sort({ _id: -1 })
        .limit(4)
        .then(async (documents) => {
          let rates1 = [];
          for (var i = 0; i < documents.length; i++) {
            await Rating.find({ product_id: documents[i]._id }).then(
              async (rates) => {
                let total = 0;
                let totalRate = 0;
                if (rates.length > 0) {
                  rates.forEach((rate) => {
                    total = total + rate.rate;
                  });
                  totalRate = total / rates.length;
                }
                rates1.push(totalRate);
              }
            );
          }
          return await res.json({
            response: documents,
            rates: rates1,
          });
        });
  } catch (error) {
    res.json({ response: [] });
  }
};

module.exports.hotSaleDesignateOne = async (req, res) => {
  try {
    if (req.params.id === "undefined" || req.params.id.length !== 24) {
      return res.json({
        status: false,
        message: "No such product",
      });
    } else {
      let to_designate = await Product.findById(req.params.id);
      HotSale.count({ category_id: to_designate.category_id }).then((count) => {
        if (count === 4) {
          return res.json({
            status: false,
            message: "this category already has 4 hot sale items",
          });
        }
      });
      let newHotSale = new HotSale({
        category_id: to_designate.category_id,
        product_id: to_designate._id,
      });
      newHotSale
        .save()
        .then((response) => {
          return res.json({
            message: "designated as a hot sale ",
            success: true,
          });
        })
        .catch((error) => {
          return res.json({
            message: "designaton failed, already exists",
            success: false,
          });
        });
    }
  } catch (error) {
    res.json({ message: "designaton failed", success: false });
  }
};

module.exports.hotSaleUndesignateOne = async (req, res) => {
  try {
    if (req.params.id === "undefined" || req.params.id.length !== 24) {
      return res.json({
        status: false,
        message: "No such unit",
      });
    } else {
      HotSale.findByIdAndDelete(req.params.id).then(() => {
        res.json({ message: "complete ", success: true });
      });
    }
  } catch (error) {
    res.json({ message: "Internal Server Error", success: false });
  }
};

module.exports.hotSaleByCategorey = async (req, res) => {
  try {
    HotSale.find({ category_id: req.params.id }).then((response) => {
      res.json({ message: "complete ", success: true, response });
    });
  } catch (error) {
    res.json({
      message: "Internal Server Error",
      success: false,
      response: [],
    });
  }
};

module.exports.getProductBySubCategory2filter = async (req, res) => {
  let _id = req.params.id;
  const body = req.body;
  const perPage = 12;
  const query = {
    subCategory: _id,
    view: true,
  };
  if (body.minprice || body.maxprice) {
    query.price_after = {};
    if (body.minprice) {
      query.price_after.$gte = body.minprice;
    }
    if (body.maxprice) {
      query.price_after.$lte = body.maxprice;
    }
  }

  if (body.sizes) {
    query.quantity = { $in: body.sizes };
  }
  if (body.minpercent) {
    query.$expr = {
      $and: [
        {
          $gte: [
            {
              $multiply: [{ $divide: ["$price_after", "$price_before"] }, 100],
            },
            body.minpercent,
          ],
        },
        {
          $lte: [
            {
              $multiply: [{ $divide: ["$price_after", "$price_before"] }, 100],
            },
            body.maxpercent,
          ],
        },
      ],
    };
  }
  const options = {
    skip: (req.params.page - 1) * perPage,
    limit: perPage,
  };
  Product.find(query, null, options)
    .then(async (e) => {
      let rates1 = [];
      for (var i = 0; i < e.length; i++) {
        await Rating.find({ product_id: e[i]._id }).then(async (rates) => {
          let total = 0;
          let totalRate = 0;
          if (rates.length > 0) {
            rates.forEach((rate) => {
              total = total + rate.rate;
            });
            totalRate = total / rates.length;
          }
          rates1.push(totalRate);
        });
      }
      const count = await Product.count(query);
      console.log("Hello", count); ///prints but doesn't return
      return res.json({
        response: e,
        rates: rates1,
        count: count,
      });
    })
    .catch((err) => {
      return res.json({ message: err.message });
    });
};
