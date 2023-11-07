const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
var validation = require("../../validation/main.validation.js").validation;
var {sign_up} = require("../../validation/user.validation");

const {
  viewProfile,
  signUp,
  updateProfile,
  deleteProfile,
  login,
  getall,
  search,
  view, viewed, changepassword, softDeleteUser, facebookSocailLogin, googleSocialLogin
} = require("../../controllers/UserController");

router.get("/view_profile", checkToken([roles.user]), viewProfile);
router.get("/", checkToken([roles.admin]), getall);
router.post("/sign_up",validation(sign_up), signUp);
router.post("/view", checkToken([roles.user]), view);
router.get("/viewed", checkToken([roles.user]), viewed);
router.post("/search", checkToken([roles.user]), search);
router.post("/login", login);
router.patch("/update_profile", checkToken([roles.user]), updateProfile);
router.delete("/delete_profile", checkToken([roles.user]), deleteProfile);
router.patch("/update_password", checkToken([roles.user]), changepassword);
router.patch("/softDelete", checkToken([roles.user]), softDeleteUser);
//socialLogin
router.post("/google-login", googleSocialLogin);
router.post("/facebook-login",facebookSocailLogin);



module.exports = router;
