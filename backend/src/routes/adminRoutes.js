const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/auth');
const { verifyRole } = require('../middlewares/rbac');

router.get('/analytics/overview', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), AdminController.getAnalyticsOverview);
router.get('/customers', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), AdminController.getCustomers);
router.get('/settings', AdminController.getSettings);

module.exports = router;
