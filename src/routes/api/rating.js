const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const ratingController = require("../../controllers/rating");

router.post("/create/:product_id", checkToken, ratingController.createRate);
router.delete("/delete/:product_id", ratingController.deleteRate);

module.exports = router;
