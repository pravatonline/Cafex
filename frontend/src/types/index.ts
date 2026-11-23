export type DietaryFlags = {
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_keto: boolean;
  is_vegetarian: boolean;
};

export type NutritionFacts = {
  fat: string;
  carbs: string;
  protein: string;
  sugar: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
};

export type AddonOption = {
  id: string;
  group_name: string;
  name: string;
  price_delta: number;
  is_default?: boolean;
};

export type Product = {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  base_price: number;
  sale_price?: number | null;
  sku: string;
  image_url: string;
  secondary_images?: string[];
  is_available: boolean;
  is_featured: boolean;
  is_chef_special: boolean;
  preparation_time_minutes: number;
  calories: number;
  dietary_flags: DietaryFlags;
  nutrition_facts: NutritionFacts;
  allergens: string[];
  roast_level?: string | null;
  rating_avg: number;
  rating_count: number;
};

export type SelectedAddon = {
  group: string;
  name: string;
  price: number;
};

export type CartItem = {
  cartItemId: string; // unique cart line id
  productId: string;
  name: string;
  slug: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  selectedAddons: SelectedAddon[];
  specialInstructions?: string;
};

export type OrderType = 'delivery' | 'takeaway' | 'dine_in';
export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
export type PaymentMethod = 'stripe' | 'razorpay' | 'phonepe' | 'payu' | 'paypal' | 'cod';

export type Order = {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: OrderType;
  status: OrderStatus;
  delivery_address?: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postal_code: string;
  } | null;
  items: {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    selected_addons: SelectedAddon[];
    special_instructions?: string;
  }[];
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  delivery_fee: number;
  tip_amount: number;
  total_amount: number;
  coupon_applied?: string | null;
  points_redeemed?: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  estimated_delivery_time?: string;
  status_history?: {
    status: OrderStatus;
    timestamp: string;
    notes?: string;
  }[];
};

export type Reservation = {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  seating_preference: 'Indoor' | 'Window' | 'Patio' | 'Rooftop' | 'Private Lounge' | 'any';
  table_number?: string;
  reservation_date: string;
  reservation_time: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'staff' | 'kitchen' | 'manager' | 'admin' | 'super_admin';
  loyalty?: {
    points_balance: number;
    lifetime_points?: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  };
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  is_first_order_only: boolean;
  is_active: boolean;
};

export type Review = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
};
