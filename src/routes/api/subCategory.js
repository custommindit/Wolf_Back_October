const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const subCategoryController = require("../../controllers/sub_category");


router.post("/create", subCategoryController.add_subcategory);
router.get('/main_category/:id', subCategoryController.get_subcategory_by_main_category)

module.exports = router;