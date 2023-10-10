const { Router } = require('express');
const product_controller = require('../../controllers/product');

const multer = require('multer');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.array('images'), product_controller.uplodaImage);

   
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/excel/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname); 
    }
});

const upload2 = multer({ storage: storage2 });

router.post('/upload', upload.array('images'), product_controller.uplodaImage);

router.get('/', product_controller.AllProducts)
router.get('/:id', product_controller.getProduct)
router.get('/category/:id', product_controller.getProductBySubCategory)
router.post('/category/:id', product_controller.getProductBySubCategoryfilter)
router.get('/category2/:id', product_controller.getProductBySubCategory2)
router.get('/main_category/:id', product_controller.getProductByMainCategory)
router.get('/first_visit/:id', product_controller.getProductFirstVisit)
router.put('/update_first_visit/:id', product_controller.UpdateFirstVisitProduct)
router.get('/all_of_category/:id', product_controller.getProductByType)
////router.post('/excel', upload2.single('excel'), product_controller.getDataFromExcel)
router.post('/from_excel', product_controller.CreateProducts)

router.put('/view/:id', product_controller.UpdateViewProduct)
router.delete('/:id', product_controller.DeleteProduct)
router.post('/search',product_controller.SearchByName)
router.post('/searchpage',product_controller.SearchByNameBulk)
router.post('/searchpagefilter', product_controller.searchProductfilter)
router.post('/cart',product_controller.cart)
router.post('/getmodels',product_controller.models)
router.post('/tryon',product_controller.tryon)
router.post('/recomm',product_controller.recomm)

module.exports = router