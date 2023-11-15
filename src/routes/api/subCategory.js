const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const subCategoryController = require("../../controllers/sub_category");

router.post("/create", subCategoryController.add_subcategory);
router.get(
  "/main_category/:id",
  subCategoryController.get_subcategory_by_main_category
);
router.get("/main_subcategory/", subCategoryController.get_subCategory);
router.get("/count/:id", subCategoryController.gettotalcount);

router.get("/:id", subCategoryController.get_subcategory_by_id);
router.put("/:id", subCategoryController.update_subcategory);

module.exports = router;
