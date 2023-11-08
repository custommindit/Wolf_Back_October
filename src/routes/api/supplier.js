const router = require("express").Router();
const { checkToken, roles } = require("../../auth/token_validation");
const {
    signUp,login,show,hide,CreateProduct,myProducts,Allsuppliers,enable,disable
}=require('../../controllers/supplier')

router.post("/sign_up", signUp);
router.get("/my", myProducts);
router.get("/all", Allsuppliers)
router.post('/',checkToken([roles.admin]),CreateProduct)
router.post("/login", login);
router.put('/show/:id',checkToken([roles.admin]),show)
router.put('/hide/:id',checkToken([roles.admin]),hide)
router.put('/enable/:id',checkToken([roles.admin]),enable)
router.put('/disable/:id',checkToken([roles.admin]),disable)


module.exports = router