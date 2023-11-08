const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const colorsController = require("../../controllers/colors");

router.get("/", checkToken([roles.user]), colorsController.AllColors);
router.get("/sub_category/:sub_category", colorsController.bysubcategory);

module.exports = router;
