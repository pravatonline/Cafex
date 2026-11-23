const { memoryStore } = require('../config/db');
const PaymentService = require('../services/paymentService');
const LoyaltyService = require('../services/loyaltyService');

class OrderController {
  /**
   * Create / Place a new order
   */
  static async createOrder(req, res, next) {
    try {
      const {
        orderType = 'delivery',
        customer,
        deliveryAddress,
        items,
        couponCode,
        pointsToRedeem = 0,
        tipAmount = 0,
        paymentMethod = 'cod',
        deliveryNotes
      } = req.body;

      if (!customer || !customer.name || !customer.phone) {
        return res.status(400).json({ success: false, message: 'Customer name and phone number are required.' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
      }

      // Calculate Subtotal
      let subtotal = 0;
      const formattedItems = items.map(item => {
        const itemTotal = Number(item.unitPrice) * Number(item.quantity);
        subtotal += itemTotal;
        return {
          product_id: item.productId,
          product_name: item.productName,
          unit_price: Number(item.unitPrice),
          quantity: Number(item.quantity),
          total_price: itemTotal,
          selected_addons: item.selectedAddons || [],
          special_instructions: item.specialInstructions || ''
        };
      });

      // Apply Coupon Discount
      let discountAmount = 0;
      let appliedCoupon = null;

      if (couponCode) {
        const coupon = memoryStore.coupons.find(
          c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.is_active
        );

        if (coupon) {
          if (subtotal >= coupon.min_order_amount) {
            if (coupon.discount_type === 'percentage') {
              let calc = (subtotal * coupon.discount_value) / 100;
              if (coupon.max_discount_amount && calc > coupon.max_discount_amount) {
                calc = coupon.max_discount_amount;
              }
              discountAmount = calc;
            } else {
              discountAmount = Math.min(coupon.discount_value, subtotal);
            }
            appliedCoupon = coupon.code;
            coupon.used_count += 1;
          }
        }
      }

      // Apply Loyalty Points Deduction (100 points = $1.00)
      let loyaltyDiscount = 0;
      const userId = req.user ? req.user.id : null;
      if (userId && pointsToRedeem > 0) {
        try {
          const redemption = LoyaltyService.redeemPoints(userId, pointsToRedeem);
          loyaltyDiscount = redemption.discount;
          discountAmount += loyaltyDiscount;
        } catch (err) {
          console.warn('Loyalty redemption error:', err.message);
        }
      }

      // Delivery Fee calculation
      let deliveryFee = 0;
      if (orderType === 'delivery') {
        deliveryFee = subtotal >= 35 ? 0 : 3.99;
      }

      // Tax (8.5%)
      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const taxAmount = Number((taxableAmount * 0.085).toFixed(2));
      const parsedTip = Number(tipAmount) || 0;

      // Total Calculation
      const totalAmount = Number((taxableAmount + taxAmount + deliveryFee + parsedTip).toFixed(2));

      // Order Reference Number
      const orderNumber = `CFX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        id: `ord-${Date.now()}`,
        order_number: orderNumber,
        user_id: userId,
        customer_name: customer.name,
        customer_email: customer.email || 'customer@example.com',
        customer_phone: customer.phone,
        order_type: orderType,
        status: 'placed',
        delivery_address: deliveryAddress || null,
        delivery_notes: deliveryNotes || '',
        items: formattedItems,
        subtotal: Number(subtotal.toFixed(2)),
        discount_amount: Number(discountAmount.toFixed(2)),
        tax_amount: taxAmount,
        delivery_fee: deliveryFee,
        tip_amount: parsedTip,
        total_amount: totalAmount,
        coupon_applied: appliedCoupon,
        points_redeemed: pointsToRedeem,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
        created_at: new Date().toISOString(),
        estimated_delivery_time: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
        status_history: [
          {
            status: 'placed',
            timestamp: new Date().toISOString(),
            notes: 'Order received and waiting kitchen acceptance.'
          }
        ]
      };

      memoryStore.orders.unshift(newOrder);

      // Create Payment Intent with Payment Gateway
      let paymentData = null;
      if (paymentMethod !== 'cod') {
        paymentData = await PaymentService.createPaymentIntent({
          orderId: newOrder.id,
          amount: totalAmount,
          currency: 'USD',
          gateway: paymentMethod,
          customer
        });
      }

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: newOrder,
        paymentData
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Real-time order tracking by Order Number or ID
   */
  static async getOrderTracking(req, res, next) {
    try {
      const { identifier } = req.params;
      const order = memoryStore.orders.find(
        o => o.order_number.toLowerCase() === identifier.toLowerCase() || o.id === identifier
      );

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order tracking details not found.' });
      }

      res.status(200).json({
        success: true,
        order
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get orders for authenticated user
   */
  static async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const userOrders = memoryStore.orders.filter(o => o.user_id === userId);

      res.status(200).json({
        success: true,
        count: userOrders.length,
        orders: userOrders
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Get all orders with filter
   */
  static async getAllOrdersAdmin(req, res, next) {
    try {
      const { status, orderType, search } = req.query;

      let orders = [...memoryStore.orders];

      if (status && status !== 'all') {
        orders = orders.filter(o => o.status === status);
      }

      if (orderType && orderType !== 'all') {
        orders = orders.filter(o => o.order_type === orderType);
      }

      if (search) {
        const q = search.toLowerCase();
        orders = orders.filter(
          o =>
            o.order_number.toLowerCase().includes(q) ||
            o.customer_name.toLowerCase().includes(q) ||
            o.customer_phone.includes(q)
        );
      }

      res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin / Staff: Update order status
   */
  static async updateOrderStatusAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      }

      const order = memoryStore.orders.find(o => o.id === id || o.order_number === id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      order.status = status;
      if (!order.status_history) order.status_history = [];
      order.status_history.push({
        status,
        timestamp: new Date().toISOString(),
        notes: notes || `Order status updated to ${status}`
      });

      // If marked delivered or completed, credit loyalty points
      if ((status === 'delivered' || status === 'completed') && order.user_id && !order.points_credited) {
        const points = LoyaltyService.calculatePointsEarned(order.subtotal);
        LoyaltyService.creditPoints(order.user_id, points);
        order.points_credited = true;
        order.points_earned = points;
      }

      res.status(200).json({
        success: true,
        message: `Order status successfully updated to '${status}'.`,
        order
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
