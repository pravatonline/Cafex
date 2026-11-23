const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/couponController');
const { verifyToken } = require('../middlewares/auth');
const { verifyRole } = require('../middlewares/rbac');

// Validate coupon during checkout
router.post('/validate', CouponController.validateCoupon);

// Admin management
router.get('/admin/all', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), CouponController.getAllCoupons);
router.post('/admin', verifyToken, verifyRole(['admin', 'super_admin']), CouponController.createCoupon);
router.patch('/admin/:id/toggle', verifyToken, verifyRole(['admin', 'super_admin']), CouponController.toggleCoupon);

module.exports = router;
