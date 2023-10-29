const { Router } = require("express");
const product_controller = require("../../controllers/product");

const multer = require("multer");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/uploadLocal", upload.array("images"), product_controller.uploadImage);
router.post("/uploadCloud", upload.array("images"), product_controller.uploadImageCloud );

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/excel/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload2 = multer({ storage: storage2 });

router.get("/", product_controller.getProducts);
router.post("/upload", upload.array("images"), product_controller.uploadImage);

router.get("/:id", product_controller.getProductById);

router.get("/category2/:id/:page", product_controller.getProductBySubCategory2);
router.get("/main_category/:id", product_controller.getProductByMainCategory);
router.get("/first_visit/:id", product_controller.getProductFirstVisit);
router.put(
  "/update_first_visit/:id",
  product_controller.UpdateFirstVisitProduct
);

////router.post('/excel', upload2.single('excel'), product_controller.getDataFromExcel)
//router.post('/from_excel', product_controller.CreateProducts)

router.put("/view/:id", product_controller.UpdateViewProduct);
router.delete("/:id", product_controller.DeleteProduct);
router.post("/search", product_controller.SearchByName);
router.post("/searchpage", product_controller.SearchByNameBulk);
//router.post('/searchpagefilter', product_controller.searchProductfilter)
router.post("/cart", product_controller.cart);
router.post("/getmodels", product_controller.models);
router.post("/tryon", product_controller.tryon);
router.post("/recomm", product_controller.recomm);

router.get("/home_latest/:id", product_controller.getHomeRecents);

router.get("/home_subcategory/:id", product_controller.gethomesublist);

router.post("/designatehotsale/:id", product_controller.hotSaleDesignateOne);
router.post(
  "/undesignatehotsale/:id",
  product_controller.hotSaleUndesignateOne
);

router.get("/hotsales/:id", product_controller.hotSaleByCategorey);

router.post(
  "/category2filter/:id/:page",
  product_controller.getProductBySubCategory2filter
);

router.post("/test", product_controller.salepercent);
module.exports = router;
