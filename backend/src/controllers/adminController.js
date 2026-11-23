const { memoryStore } = require('../config/db');

class AdminController {
  /**
   * Executive Analytics Dashboard KPIs & Charts
   */
  static async getAnalyticsOverview(req, res, next) {
    try {
      const orders = memoryStore.orders;

      // Calculate financials
      const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total_amount : 0), 0);
      const totalOrdersCount = orders.length;
      const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;

      // Customer stats
      const customersCount = memoryStore.users.filter(u => u.role === 'customer').length;

      // Status breakdown
      const statusCounts = {
        placed: orders.filter(o => o.status === 'placed').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
        delivered: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      };

      // Top Selling Items
      const topSellingItems = memoryStore.products
        .sort((a, b) => b.rating_count - a.rating_count)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category_name,
          price: p.sale_price || p.base_price,
          ordersCount: p.rating_count,
          imageUrl: p.image_url
        }));

      // Sales Trend (7-day timeline)
      const salesTrend = [
        { day: 'Mon', revenue: 1420, orders: 48 },
        { day: 'Tue', revenue: 1680, orders: 55 },
        { day: 'Wed', revenue: 1950, orders: 64 },
        { day: 'Thu', revenue: 2100, orders: 72 },
        { day: 'Fri', revenue: 2840, orders: 96 },
        { day: 'Sat', revenue: 3450, orders: 122 },
        { day: 'Sun', revenue: 3120, orders: 110 }
      ];

      // Category share
      const categorySales = [
        { category: 'Artisan Coffee', percentage: 42 },
        { category: 'Cold Brew & Nitro', percentage: 22 },
        { category: 'Bakery & Pastries', percentage: 18 },
        { category: 'Gourmet Sandwiches', percentage: 12 },
        { category: 'Organic Teas', percentage: 6 }
      ];

      res.status(200).json({
        success: true,
        kpis: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrdersCount,
          avgOrderValue: Number(avgOrderValue.toFixed(2)),
          customersCount,
          activeTablesCount: memoryStore.tables.filter(t => t.status === 'available').length,
          activeCouponsCount: memoryStore.coupons.filter(c => c.is_active).length
        },
        statusCounts,
        salesTrend,
        categorySales,
        topSellingItems
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Customer Directory with spend history & loyalty tier
   */
  static async getCustomers(req, res, next) {
    try {
      const customers = memoryStore.users
        .filter(u => u.role === 'customer')
        .map(u => {
          const userOrders = memoryStore.orders.filter(o => o.user_id === u.id || o.customer_email === u.email);
          const totalSpent = userOrders.reduce((sum, o) => sum + o.total_amount, 0);
          const loyalty = memoryStore.loyalty_accounts[u.id] || { points_balance: 0, tier: 'Bronze' };

          return {
            id: u.id,
            fullName: u.full_name,
            email: u.email,
            phone: u.phone,
            totalOrders: userOrders.length,
            totalSpent: Number(totalSpent.toFixed(2)),
            loyaltyPoints: loyalty.points_balance,
            loyaltyTier: loyalty.tier,
            isActive: u.is_active,
            registeredAt: u.created_at
          };
        });

      res.status(200).json({
        success: true,
        count: customers.length,
        customers
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Cafe System Settings
   */
  static async getSettings(req, res, next) {
    try {
      const settings = {
        cafeName: 'Cafex Artisan Roastery & Bistro',
        tagline: 'Crafted with passion, roasted to perfection.',
        phone: '+1 (555) 749-2831',
        email: 'hello@cafex.com',
        address: '742 Evergreen Terrace, Downtown Tech District, San Francisco, CA 94107',
        currency: 'USD',
        currencySymbol: '$',
        taxRatePercent: 8.5,
        deliveryFee: 3.99,
        freeDeliveryThreshold: 35.00,
        gateways: {
          razorpay: true,
          stripe: true,
          phonepe: true,
          payu: true,
          paypal: true,
          cod: true
        },
        hours: {
          weekdays: '06:30 AM - 09:00 PM',
          weekends: '07:30 AM - 10:00 PM'
        }
      };

      res.status(200).json({
        success: true,
        settings
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
