const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  viewProfile,
  signUp,
  updateProfile,
  deleteProfile,
  login,
  getall,
  search,
  view, viewed, changepassword
} = require("../../controllers/UserController");

router.get("/view_profile", checkToken, viewProfile);
router.get("/", checkToken, getall);
router.post("/sign_up", signUp);
router.post("/view", checkToken, view);
router.get("/viewed", checkToken, viewed);
router.post("/search", checkToken, search);
router.post("/login", login);
router.patch("/update_profile", checkToken, updateProfile);
router.delete("/delete_profile", checkToken, deleteProfile);
router.patch("/update_password", checkToken, changepassword);

module.exports = router;
