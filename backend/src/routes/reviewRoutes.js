const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { verifyToken, optionalToken } = require('../middlewares/auth');
const { verifyRole } = require('../middlewares/rbac');

router.post('/', optionalToken, ReviewController.createReview);
router.get('/product/:productId', ReviewController.getProductReviews);
router.get('/admin/all', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), ReviewController.getAllReviewsAdmin);
router.delete('/admin/:id', verifyToken, verifyRole(['admin', 'super_admin']), ReviewController.deleteReview);

module.exports = router;
