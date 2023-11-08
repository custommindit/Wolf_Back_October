const { Router } = require("express");
const multer = require("multer");
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
const orderRouter = require("./api/order_items");
const adminRouter = require("./api/admin");
const { uploadFile, uploadFiles } = require("../controllers/upload");

const router = Router();

const upload = multer({ dest: "uploads/" });

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
router.use("/order", orderRouter);
router.use("/admin", adminRouter);
router.post("/upload", upload.single("file"), uploadFile);
router.post("/upload-multiple", upload.array("files"), uploadFiles);

module.exports = router;
