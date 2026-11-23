const { memoryStore } = require('../config/db');

class CouponController {
  /**
   * Validate Coupon for a given Cart Amount
   */
  static async validateCoupon(req, res, next) {
    try {
      const { code, cartTotal = 0 } = req.body;

      if (!code) {
        return res.status(400).json({ success: false, message: 'Coupon code is required.' });
      }

      const coupon = memoryStore.coupons.find(
        c => c.code.toUpperCase() === code.trim().toUpperCase()
      );

      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
      }

      if (!coupon.is_active) {
        return res.status(400).json({ success: false, message: 'This coupon is no longer active.' });
      }

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached.' });
      }

      const total = Number(cartTotal);
      if (total < coupon.min_order_amount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order value of $${coupon.min_order_amount.toFixed(2)} required for this coupon.`
        });
      }

      let calculatedDiscount = 0;
      if (coupon.discount_type === 'percentage') {
        calculatedDiscount = (total * coupon.discount_value) / 100;
        if (coupon.max_discount_amount && calculatedDiscount > coupon.max_discount_amount) {
          calculatedDiscount = coupon.max_discount_amount;
        }
      } else {
        calculatedDiscount = Math.min(coupon.discount_value, total);
      }

      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully!',
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          calculatedDiscount: Number(calculatedDiscount.toFixed(2))
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: List all coupons
   */
  static async getAllCoupons(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        coupons: memoryStore.coupons
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Create new coupon
   */
  static async createCoupon(req, res, next) {
    try {
      const {
        code,
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount,
        usageLimit,
        isFirstOrderOnly
      } = req.body;

      if (!code || !discountType || !discountValue) {
        return res.status(400).json({
          success: false,
          message: 'Code, discount type, and discount value are required.'
        });
      }

      const formattedCode = code.trim().toUpperCase();
      const existing = memoryStore.coupons.find(c => c.code === formattedCode);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
      }

      const newCoupon = {
        id: `cp-${Date.now()}`,
        code: formattedCode,
        description: description || '',
        discount_type: discountType, // 'percentage' or 'fixed'
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrderAmount) || 0,
        max_discount_amount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        usage_limit: usageLimit ? Number(usageLimit) : null,
        used_count: 0,
        is_first_order_only: Boolean(isFirstOrderOnly),
        is_active: true
      };

      memoryStore.coupons.push(newCoupon);

      res.status(201).json({
        success: true,
        message: 'Coupon created successfully.',
        coupon: newCoupon
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Toggle coupon active status
   */
  static async toggleCoupon(req, res, next) {
    try {
      const { id } = req.params;
      const coupon = memoryStore.coupons.find(c => c.id === id || c.code === id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Coupon not found.' });
      }

      coupon.is_active = !coupon.is_active;

      res.status(200).json({
        success: true,
        message: `Coupon '${coupon.code}' is now ${coupon.is_active ? 'Active' : 'Inactive'}.`,
        coupon
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CouponController;
