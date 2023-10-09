const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const colorsController = require("../../controllers/colors");

router.get("/", checkToken, colorsController.AllColors);
router.get("/sub_category/:sub_category", colorsController.bysubcategory);

module.exports = router;
