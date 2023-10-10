const { Router } = require('express')
const CartController = require('../../controllers/Wish')
const { checkToken } = require("../../auth/token_validation");

const router = Router()

router.post('/', CartController.Create_cart_item)
router.post('/:id',checkToken, CartController.Delete_by_product)
router.get('/',checkToken, CartController.Read_cart_items)
router.get('/:id', CartController.Read_cart_item)
router.delete('/:id', CartController.Delete_cart_item)
router.put('/:id', CartController.Update_cart_item)
module.exports = router