const PaymentService = require('../services/paymentService');
const { memoryStore } = require('../config/db');

class PaymentController {
  /**
   * Create Gateway Payment Intent
   */
  static async createIntent(req, res, next) {
    try {
      const { orderId, gateway } = req.body;

      const order = memoryStore.orders.find(o => o.id === orderId || o.order_number === orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found for payment processing.' });
      }

      const paymentData = await PaymentService.createPaymentIntent({
        orderId: order.id,
        amount: order.total_amount,
        currency: 'USD',
        gateway: gateway || order.payment_method || 'stripe',
        customer: {
          name: order.customer_name,
          email: order.customer_email
        }
      });

      res.status(200).json({
        success: true,
        paymentData
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify Payment Signature / Callback
   */
  static async verifyPayment(req, res, next) {
    try {
      const { orderId, gateway, transactionId, gatewayOrderId, signature } = req.body;

      const order = memoryStore.orders.find(o => o.id === orderId || o.order_number === orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      const result = await PaymentService.verifyPayment({
        gateway,
        orderId: order.id,
        transactionId,
        gatewayOrderId,
        signature
      });

      if (result.success) {
        order.payment_status = 'paid';
        order.transaction_id = result.transactionId;
        order.status = 'confirmed';
        order.status_history.push({
          status: 'confirmed',
          timestamp: new Date().toISOString(),
          notes: `Payment verified via ${gateway} (Txn ID: ${result.transactionId})`
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified and order confirmed!',
        order
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
