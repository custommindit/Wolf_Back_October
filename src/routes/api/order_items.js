const {Router} = require('express')
const order_items_controller = require('../../controllers/order_items')
const { checkToken, roles } = require('../../auth/token_validation') 

const router = Router()

router.post('/create',checkToken([roles.admin,roles.supplier,roles.user]),order_items_controller.Create_order_item)  //([roles.admin,roles.supplier])
router.get('/',checkToken([roles.admin,roles.supplier,roles.user]),order_items_controller.Read_order_items)  //([roles.admin,roles.supplier])
router.post('/supplierorder',checkToken([roles.admin]),order_items_controller.Supplier_order_items)
router.post('/supplierreturn',checkToken,order_items_controller.Supplier_return_items)
router.post('/myorders',checkToken([roles.user]),order_items_controller.User_Orders)
router.post('/myreturns',checkToken([roles.user]),order_items_controller.User_returns)
router.post('/returns',order_items_controller.returns)
router.post('/requestreturn/:id',checkToken([roles.user]),order_items_controller.start_return)
router.delete('/:id',order_items_controller.Delete_order_item)
router.put('/',order_items_controller.Update_many)
router.put('/:id',order_items_controller.Update_order_item)

router.post('/userorders',checkToken([roles.user]),order_items_controller.User_Admin_OView)
router.post('/userreturns',checkToken([roles.user]),order_items_controller.User_Admin_RView)

router.get('/stat',checkToken([roles.user]),order_items_controller.stat)

router.post('/filter',order_items_controller.filter)


module.exports = router