const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    signUp,login,show,hide,CreateProduct,myProducts,Allsuppliers,enable,disable
}=require('../../controllers/supplier')

router.post("/sign_up", signUp);
router.get("/my", myProducts);
router.get("/all", Allsuppliers)
router.post('/',checkToken,CreateProduct)
router.post("/login", login);
router.put('/show/:id',checkToken,show)
router.put('/hide/:id',checkToken,hide)
router.put('/enable/:id',checkToken,enable)
router.put('/disable/:id',checkToken,disable)


module.exports = router