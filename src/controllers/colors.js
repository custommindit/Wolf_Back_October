const Color =require( "../models/colors");

module.exports.AllColors = (req, res) => {
    Color.find()
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
    Color.find({ sub_category: req.params.sub_category
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