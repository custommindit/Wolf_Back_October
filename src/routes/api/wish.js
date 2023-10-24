const { Router } = require('express')
const wishController = require('../../controllers/Wish')
const { checkToken } = require("../../auth/token_validation");

const router = Router()

router.get('/', checkToken, wishController.Read_wish_items)
router.post('/', checkToken, wishController.Create_wish_item)
router.delete('/:id', wishController.Delete_wish_item)

module.exports = router