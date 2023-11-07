const { Router } = require('express')
const wishController = require('../../controllers/Wish')
const { checkToken, roles } = require("../../auth/token_validation");

const router = Router()

router.get('/',  checkToken([roles.user]), wishController.Read_wish_items)
router.post('/',  checkToken([roles.user]), wishController.Create_wish_item)
router.delete('/:id', wishController.Delete_wish_item)


module.exports = router