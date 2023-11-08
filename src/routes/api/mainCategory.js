const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const mainCategoryController = require("../../controllers/main_category");

router.post("/create", checkToken([roles.user]),mainCategoryController.add_mainCategory);
router.get("/", checkToken([roles.user]),mainCategoryController.get_mainCategory);
router.get("/:id", checkToken([roles.user]),mainCategoryController.get_mainCategory_by_id);
router.put("/update/:id", mainCategoryController.update_mainCategory);
router.put("/view/:id", checkToken([roles.user]),mainCategoryController.viewMainCategory);
router.put("/hidden/:id", mainCategoryController.hiddenMainCategory);
router.delete("/delete/:id", mainCategoryController.delete_mainCategory);

module.exports = router;
