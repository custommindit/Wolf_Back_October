const { Router } = require('express')
const emailController = require('../../controllers/email')

const router = Router()

router.post('/send-mail', emailController.sendMail)

module.exports = router