const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const subCategoryController = require("../../controllers/sub_category");

router.post("/create", subCategoryController.add_subcategory);
router.get(
  "/main_category/:id",
  checkToken([roles.user]),
  subCategoryController.get_subcategory_by_main_category2
);
router.get("/main_subcategory/", subCategoryController.get_subCategory);
router.get(
  "/count/:id",
  checkToken([roles.user]),
  subCategoryController.gettotalcount
);
router.put("/:id", subCategoryController.update_subcategory);

module.exports = router;
