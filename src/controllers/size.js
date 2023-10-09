const Size = require("../models/size");

module.exports.AllSize = (req, res) => {
  Size.find()
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

module.exports.bysubcategory = (req, res) => {
  Size.find({
    sub_category: req.params.sub_category
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