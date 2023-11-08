const {Router} = require('express')
const Admincontroller=require('../../controllers/admin')
const { checkToken, roles } = require("../../auth/token_validation");

const router = Router()

router.post('/', Admincontroller.login)

router.post('/new', Admincontroller.signUp)
router.get('/checkauth',checkToken([roles.admin]), Admincontroller.auth)

module.exports = router