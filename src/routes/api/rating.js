const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const ratingController = require("../../controllers/rating");

router.post("/create/:product_id", checkToken([roles.user]), ratingController.createRate);
router.delete("/delete/:product_id",checkToken([roles.user]), ratingController.deleteRate);

module.exports = router;
