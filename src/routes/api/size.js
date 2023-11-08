const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const sizeController = require("../../controllers/size");

router.get("/", checkToken([roles.user]), sizeController.AllSize);
router.get("/sub_category/:sub_category", checkToken([roles.user]), sizeController.bysubcategory);

module.exports = router;
