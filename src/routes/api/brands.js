const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const brandController = require("../../controllers/brands");

router.get("/", checkToken, brandController.Allbrands);
router.get("/sub_category/:sub_category", brandController.bysubcategory);

module.exports = router;