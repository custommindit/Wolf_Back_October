const { Router } = require("express");
const router = Router();
const {
  create,
  index,
  show,
  edit,
  destroy,
} = require("../../controllers/banner");

router.post("/create", create);
router.get("/", index);
router.get("/:id", show);
router.put("/:id", edit);
router.delete("/", destroy);

module.exports = router;
