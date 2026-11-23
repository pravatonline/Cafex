const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { verifyToken, optionalToken } = require('../middlewares/auth');
const { verifyRole } = require('../middlewares/rbac');

// Place Order (Authenticated or Guest)
router.post('/', optionalToken, OrderController.createOrder);

// Real-time tracking
router.get('/track/:identifier', OrderController.getOrderTracking);

// User's order history
router.get('/my-orders', verifyToken, OrderController.getUserOrders);

// Admin / Kitchen Management
router.get('/admin/all', verifyToken, verifyRole(['admin', 'super_admin', 'manager', 'staff', 'kitchen']), OrderController.getAllOrdersAdmin);
router.patch('/admin/:id/status', verifyToken, verifyRole(['admin', 'super_admin', 'manager', 'staff', 'kitchen']), OrderController.updateOrderStatusAdmin);

module.exports = router;
