const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menuController');
const { verifyToken } = require('../middlewares/auth');
const { verifyRole } = require('../middlewares/rbac');

// Public endpoints
router.get('/categories', MenuController.getCategories);
router.get('/products', MenuController.getProducts);
router.get('/products/:slug', MenuController.getProductBySlug);

// Admin endpoints
router.post('/products', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), MenuController.createProduct);
router.put('/products/:id', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), MenuController.updateProduct);
router.delete('/products/:id', verifyToken, verifyRole(['admin', 'super_admin']), MenuController.deleteProduct);

module.exports = router;
