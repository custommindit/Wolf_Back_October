const { Router } = require('express')
const ratingRouter = require("./api/rating")
const colorsRouter = require("./api/colors")
const sizeRouter = require("./api/size")
const brandsRouter = require("./api/brands")

const router = Router()

router.use('/rating', ratingRouter)
router.use('/colors', colorsRouter)
router.use('/sizes', sizeRouter)
router.use('/brands', brandsRouter)

module.exports = router