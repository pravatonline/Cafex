const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

router.post('/create-intent', PaymentController.createIntent);
router.post('/verify', PaymentController.verifyPayment);

module.exports = router;
