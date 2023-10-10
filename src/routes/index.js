const { Router } = require('express')
const ratingRouter = require("./api/rating")
const colorsRouter = require("./api/colors")
const sizeRouter = require("./api/size")
const brandsRouter = require("./api/brands")
const mainCategoryRouter = require('./api/mainCategory')
const subCategoryRouter = require('./api/subCategory')
const productRouter = require('./api/product')

const router = Router()

router.use('/rating', ratingRouter)
router.use('/colors', colorsRouter)
router.use('/sizes', sizeRouter)
router.use('/brands', brandsRouter)
router.use('/main_category', mainCategoryRouter)
router.use('/subcategory', subCategoryRouter)
router.use('/product', productRouter)

module.exports = router