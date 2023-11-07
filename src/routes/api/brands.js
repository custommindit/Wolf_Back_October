const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const brandController = require("../../controllers/brands");

router.get("/", checkToken([roles.user]), brandController.Allbrands);
router.get("/sub_category/:sub_category", brandController.bysubcategory);
router.post("/home_list", brandController.homeaggregate);

module.exports = router;
