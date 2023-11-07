const mongoose = require("mongoose");
const SubCategory = require("../models/subcategory");
const Product = require("../models/product");

module.exports.add_subcategory = async (req, res) => {
  const body = req.body;

  const subcategory = new SubCategory({
    name: body.name,
    description: body.description,
    category: body.category,
    view: true,
    Image: body.image,
  });
  await subcategory
    .save()
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
};

// module.exports.get_subcategory = async (req, res) => {
//     SubCategory.find().then(e => {
//         res.status(200).json({
//             response: e
//         })
//     }).catch(err => {
//         console.log(err.message)
//         res.status(404).json({ error: err.message })
//     })
// }
module.exports.get_subCategory = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({}).populate({
      path: "category",
    });
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports.get_subcategory_by_id = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  SubCategory.findById(_id)
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(404).json({ error: err.message });
    });
};

module.exports.get_subcategory_by_main_category = async (req, res) => {
  const id = req.params.id;
  SubCategory.find({ main_category: id, view: true })
    .then((e) => {
      res.status(200).json({
        response: e,
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(404).json({ error: err.message });
    });
};

module.exports.get_subcategory_by_main_category2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await SubCategory.find({ category: id });
    console.log("here");
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.delete_subcategory = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  SubCategory.findByIdAndDelete(_id)
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(401).json({ error: err.message });
    });
};

module.exports.update_subcategory = async (req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  const data = req.body;
  SubCategory.findByIdAndUpdate(_id, data, { new: true })
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(401).json({ error: err.message });
    });
};

module.exports.UpdateViewSubcategory = async (req, res) => {
  const body = req.body;
  let _id = new mongoose.Types.ObjectId(req.params.id);
  await SubCategory.findOneAndUpdate(
    { _id: _id },
    { $set: body },
    { new: true }
  )
    .then((e) => {
      Product.updateMany({ subCategory: _id }, { $set: { view: false } }).then(
        () => {
          res.json({
            message: "disabled",
          });
        }
      );
    })
    .catch((err) => {
      return res.json({ message: "Error" });
    });
};

module.exports.gettotalcount = async (req, res) => {
  await Product.count({ subCategory: req.params.id })
    .then((e) => {
      return res.json({ success: false, count: e });
    })
    .catch((err) => {
      return res.json({ success: false, count: 0 });
    });
};
