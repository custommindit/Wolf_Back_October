const { Router } = require('express')
const CartController = require('../../controllers/cart')
const { checkToken, roles } = require("../../auth/token_validation");

const router = Router()

router.post('/', checkToken([roles.user]), CartController.Create_cart_item)
router.get('/', checkToken([roles.user]), CartController.Read_cart_items)
router.delete('/:id', checkToken([roles.user]), CartController.Delete_cart_item)
router.put('/plus/:id', checkToken([roles.user]), CartController.add_one_quantity)
router.put('/minus/:id', checkToken([roles.user]), CartController.remove_one_quantity)

module.exports = router