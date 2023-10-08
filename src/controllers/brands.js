const Brand =require( "../models/brands");

module.exports.Allbrands = (req, res) => {
    Brand.find()
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
    Brand.find({ sub_category: req.params.sub_category
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