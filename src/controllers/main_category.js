const mongoose = require("mongoose");
const MainCategory = require("../models/main_category");
const Product = require("../models/product");

module.exports.add_mainCategory = async (req, res) => {
  const { name, view, description } = req.body;
  const isCategoryExist = await MainCategory.findOne({ name });
  if (isCategoryExist) {
    return res.json({
      message: "this name is exist before enter another name",
    });
  }
  const main_category = new MainCategory({
    name: name,
    view: view,
    description,
  });
  main_category
    .save()
    .then((e) => {
      return res.status(200).json({ message: "Category Created Successfuly" });
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
};

const appendStockAndSuppliers = async (categories) => {
  const categoriesWithAppendedItems = await Promise.all(
    categories.map(async (category) => {
      const suppliers = await Product.find({
        category: category._id,
      }).distinct("supplier");
      return {
        ...category._doc,
        suppliers: suppliers.length,
        stock: await Product.find({
          category: category._id,
        }).countDocuments(),
      };
    })
  );
  return categoriesWithAppendedItems;
};

module.exports.get_mainCategory = async (req, res) => {
  try {
    let categories = await MainCategory.find({});
    categories = await appendStockAndSuppliers(categories);
    res.status(200).json({ response: categories });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.get_mainCategory_by_id = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  await MainCategory.findById(_id)
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
};

module.exports.update_mainCategory = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const data = req.body;
  await MainCategory.findByIdAndUpdate(_id, data, { new: true })
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
};

module.exports.viewMainCategory = async (req, res) => {
  await MainCategory.findByIdAndUpdate(
    req.params.id,
    { $set: { view: true } },
    { new: true }
  )
    .then((e) => {
      res.status(200).json({
        response: e,
      });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
};

module.exports.hiddenMainCategory = async (req, res) => {
  await MainCategory.findByIdAndUpdate(
    req.params.id,
    { $set: { view: false } },
    { new: true }
  )
    .then((e) => {
      res.status(200).json({
        response: e,
      });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
};

module.exports.delete_mainCategory = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  await MainCategory.findByIdAndDelete(_id)
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
};

module.exports.search = async (req, res) => {
  const name = req.query.name;
  console.log("search");
  try {
    const categories = await MainCategory.find({
      name: { $regex: name, $options: "i" },
    });
    res.status(200).json({ response: categories });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
