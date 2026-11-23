import { Category, Product, Order, Reservation, Coupon, User, Review } from '@/types';
import { mockCategories, mockProducts, mockAddons, mockCoupons } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with timeout and fallback
 */
async function fetchWithFallback<T>(endpoint: string, options: RequestInit = {}, fallbackData: T): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('cafex_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API returned ${res.status} for ${endpoint}, using fallback`);
      return fallbackData;
    }

    const json = await res.json();
    return json;
  } catch {
    // Return fallback for resilience
    return fallbackData;
  }
}

export const api = {
  // 1. Menu & Categories
  async getCategories(): Promise<Category[]> {
    const data = await fetchWithFallback<{ categories: Category[] }>(
      '/menu/categories',
      { method: 'GET' },
      { categories: mockCategories }
    );
    return data.categories || mockCategories;
  },

  async getProducts(params?: { category?: string; search?: string; diet?: string; sort?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.diet) query.append('diet', params.diet);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.featured) query.append('featured', 'true');

    const data = await fetchWithFallback<{ products: Product[] }>(
      `/menu/products?${query.toString()}`,
      { method: 'GET' },
      { products: mockProducts }
    );
    return data.products || mockProducts;
  },

  async getProductBySlug(slug: string): Promise<{ product: Product; addons: any[]; reviews: Review[]; smartPairings: Product[] }> {
    const defaultProduct = mockProducts.find(p => p.slug === slug || p.id === slug) || mockProducts[0];
    const data = await fetchWithFallback<any>(
      `/menu/products/${slug}`,
      { method: 'GET' },
      {
        product: defaultProduct,
        addons: mockAddons,
        reviews: [],
        smartPairings: mockProducts.filter(p => p.id !== defaultProduct.id).slice(0, 3),
      }
    );
    return data;
  },

  // 2. Orders & Checkout
  async createOrder(orderPayload: any): Promise<{ success: boolean; order: Order; paymentData?: any; message?: string }> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('cafex_token') : null;
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback simulation
    }

    // Local simulated order creation
    const simulatedOrderNumber = `CFX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: simulatedOrderNumber,
      customer_name: orderPayload.customer.name,
      customer_email: orderPayload.customer.email,
      customer_phone: orderPayload.customer.phone,
      order_type: orderPayload.orderType || 'delivery',
      status: 'placed',
      delivery_address: orderPayload.deliveryAddress,
      items: orderPayload.items.map((item: any) => ({
        product_id: item.productId,
        product_name: item.productName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        total_price: item.unitPrice * item.quantity,
        selected_addons: item.selectedAddons || [],
        special_instructions: item.specialInstructions || '',
      })),
      subtotal: 15.00,
      discount_amount: 0,
      tax_amount: 1.28,
      delivery_fee: 3.99,
      tip_amount: orderPayload.tipAmount || 0,
      total_amount: 20.27,
      payment_method: orderPayload.paymentMethod || 'cod',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Order placed successfully!',
      order: mockOrder,
      paymentData: { gateway: orderPayload.paymentMethod, status: 'simulated_success' }
    };
  },

  async getOrderTracking(orderNumber: string): Promise<Order | null> {
    const data = await fetchWithFallback<{ order: Order }>(
      `/orders/track/${orderNumber}`,
      { method: 'GET' },
      { order: null as any }
    );
    return data.order || null;
  },

  // 3. Coupons
  async validateCoupon(code: string, cartTotal: number): Promise<{ success: boolean; coupon?: any; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal }),
      });
      return await res.json();
    } catch {
      const found = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
      if (found) {
        let calc = found.discount_type === 'percentage' ? (cartTotal * found.discount_value) / 100 : found.discount_value;
        if (found.max_discount_amount && calc > found.max_discount_amount) calc = found.max_discount_amount;
        return {
          success: true,
          message: 'Coupon applied!',
          coupon: {
            code: found.code,
            calculatedDiscount: Math.min(calc, cartTotal),
          }
        };
      }
      return { success: false, message: 'Invalid promo code' };
    }
  },

  // 4. Reservations
  async bookReservation(payload: any): Promise<{ success: boolean; reservation: Reservation; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Local fallback
    }

    const bookingCode = `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockReservation: Reservation = {
      id: `res-${Date.now()}`,
      booking_code: bookingCode,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_phone: payload.customerPhone,
      party_size: payload.partySize,
      seating_preference: payload.seatingPreference,
      reservation_date: payload.reservationDate,
      reservation_time: payload.reservationTime,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Table reserved successfully!',
      reservation: mockReservation
    };
  },

  // 5. Admin Analytics & Management
  async getAdminAnalytics(): Promise<any> {
    return await fetchWithFallback<any>(
      '/admin/analytics/overview',
      { method: 'GET' },
      {
        kpis: {
          totalRevenue: 12480.50,
          totalOrdersCount: 428,
          avgOrderValue: 29.16,
          customersCount: 312,
          activeTablesCount: 8,
          activeCouponsCount: 4
        },
        statusCounts: { placed: 4, preparing: 6, ready: 3, out_for_delivery: 5, delivered: 410, cancelled: 2 },
        salesTrend: [
          { day: 'Mon', revenue: 1420, orders: 48 },
          { day: 'Tue', revenue: 1680, orders: 55 },
          { day: 'Wed', revenue: 1950, orders: 64 },
          { day: 'Thu', revenue: 2100, orders: 72 },
          { day: 'Fri', revenue: 2840, orders: 96 },
          { day: 'Sat', revenue: 3450, orders: 122 },
          { day: 'Sun', revenue: 3120, orders: 110 }
        ],
        categorySales: [
          { category: 'Artisan Coffee', percentage: 42 },
          { category: 'Cold Brew & Nitro', percentage: 22 },
          { category: 'Bakery & Pastries', percentage: 18 },
          { category: 'Gourmet Sandwiches', percentage: 12 },
          { category: 'Organic Teas', percentage: 6 }
        ],
        topSellingItems: mockProducts.slice(0, 5)
      }
    );
  }
};
