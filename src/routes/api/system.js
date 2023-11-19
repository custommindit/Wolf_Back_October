const { Router } = require("express");
const router = Router();
const { index, edit } = require("../../controllers/system");

router.get("/", index);
router.put("/", edit);

module.exports = router;
