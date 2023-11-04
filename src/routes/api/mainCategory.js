const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const mainCategoryController = require("../../controllers/main_category");

router.post("/create", mainCategoryController.add_mainCategory);
router.get("/", mainCategoryController.getMainCategory);
// router.get("/", mainCategoryController.get_mainCategory);
router.get("/:id", mainCategoryController.get_mainCategory_by_id);
router.put("/update/:id", mainCategoryController.update_mainCategory);
router.put("/view/:id", mainCategoryController.viewMainCategory);
router.put("/hidden/:id", mainCategoryController.hiddenMainCategory);
router.delete("/delete/:id", mainCategoryController.delete_mainCategory);

module.exports = router;
