const { Router } = require("express");
const ratingRouter = require("./api/rating");
const colorsRouter = require("./api/colors");
const sizeRouter = require("./api/size");
const brandsRouter = require("./api/brands");
const mainCategoryRouter = require("./api/mainCategory");
const subCategoryRouter = require("./api/subCategory");
const productRouter = require("./api/product");
const rateRouter = require("./api/rating");
const userRouter = require("./api/UserRouter");
const cartRouter = require("./api/cart");
const wishRouter = require("./api/wish");

const router = Router();

router.use("/rating", ratingRouter);
router.use("/colors", colorsRouter);
router.use("/sizes", sizeRouter);
router.use("/brands", brandsRouter);
router.use("/main_category", mainCategoryRouter);
router.use("/subcategory", subCategoryRouter);
router.use("/product", productRouter);
router.use("/rate", rateRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use("/wish", wishRouter);

module.exports = router;
