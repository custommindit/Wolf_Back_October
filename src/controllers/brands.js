const Brand = require("../models/brands");
const Product = require("../models/product");

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
  Brand.find({
    sub_category: req.params.sub_category,
  })
    .then(async(response) => {
      numbers=[]
      if(response.length>0){
        for (let index = 0; index < response.length; index++) {
          const element = await Product.count({brand:response[index].name});
          numbers.push(element)
        }
      }
      res.json({
        response,
        counts:numbers
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occured!",
      });
    });
};

module.exports.homeaggregate = (req, res) => {
  const matchCriteria = {
    sub_category: {$in:req.body.sub_category},
  };
  Brand.aggregate([
    { $match: matchCriteria },
    { $sample: { size: 9 } } 
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
