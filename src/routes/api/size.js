const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const sizeController = require("../../controllers/size");

router.get("/", checkToken, sizeController.AllSize);
router.get("/sub_category/:sub_category", sizeController.bysubcategory);

module.exports = router;
