-- ==============================================================================
-- CAFEX - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Enterprise Cafe Management & Online Ordering Platform
-- Features: RBAC, Auditing, Multi-gateway Payments, Reservations, Loyalty, Reviews
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order if migrating
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reservation_logs CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS coupon_usages CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS loyalty_accounts CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_customizations CASCADE;
DROP TABLE IF EXISTS product_addons CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cafe_tables CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'kitchen', 'manager', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. CUSTOMER ADDRESSES
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home', -- Home, Office, Other
    recipient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    street_address TEXT NOT NULL,
    apartment_suite VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    landmark VARCHAR(150),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_addresses_user ON customer_addresses(user_id);

-- 3. CATEGORIES TABLE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS / MENU ITEMS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(300),
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
    sale_price DECIMAL(10, 2) CHECK (sale_price >= 0),
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(500) NOT NULL,
    secondary_images JSONB DEFAULT '[]'::jsonb,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    preparation_time_minutes INT DEFAULT 10,
    calories INT,
    dietary_flags JSONB DEFAULT '{"is_vegan": false, "is_gluten_free": false, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}'::jsonb,
    nutrition_facts JSONB DEFAULT '{"fat": "0g", "carbs": "0g", "protein": "0g", "sugar": "0g"}'::jsonb,
    allergens JSONB DEFAULT '[]'::jsonb, -- e.g. ["Milk", "Nuts"]
    roast_level VARCHAR(50), -- Light, Medium, Dark
    rating_avg DECIMAL(3, 2) DEFAULT 5.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_featured ON products(is_featured);

-- 5. PRODUCT ADDONS & CUSTOMIZATION OPTIONS
CREATE TABLE product_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE, -- NULL means global addon
    group_name VARCHAR(100) NOT NULL, -- e.g., 'Size', 'Milk Option', 'Extra Shots', 'Syrup'
    name VARCHAR(100) NOT NULL, -- e.g., 'Large (+16oz)', 'Oat Milk', 'Vanilla Syrup'
    price_delta DECIMAL(10, 2) DEFAULT 0.00,
    is_default BOOLEAN DEFAULT FALSE,
    is_multiple BOOLEAN DEFAULT FALSE, -- whether user can select multiple in this group
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_addons_product ON product_addons(product_id);

-- 6. CAFE TABLES (FOR DINE-IN & RESERVATIONS)
CREATE TABLE cafe_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    section VARCHAR(50) DEFAULT 'Indoor' CHECK (section IN ('Indoor', 'Patio', 'Window', 'Rooftop', 'Private Lounge')),
    status VARCHAR(30) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
    qr_code_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLE RESERVATIONS
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    table_id UUID REFERENCES cafe_tables(id) ON DELETE SET NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    seating_preference VARCHAR(50) DEFAULT 'Indoor',
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    special_requests TEXT,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- 8. COUPONS & DISCOUNTS
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10, 2), -- Cap for percentage discounts
    usage_limit INT, -- NULL = unlimited
    used_count INT DEFAULT 0,
    is_first_order_only BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_type VARCHAR(30) DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'takeaway', 'dine_in')),
    status VARCHAR(30) DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled')),
    
    -- Customer Info
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    
    -- Dine-in or Delivery specific
    table_id UUID REFERENCES cafe_tables(id) ON DELETE SET NULL,
    delivery_address JSONB, -- { street, city, state, postal_code, landmark }
    delivery_notes TEXT,
    estimated_delivery_time TIMESTAMPTZ,
    
    -- Financials
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    points_redeemed INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    
    -- Payment reference
    payment_status VARCHAR(30) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50) DEFAULT 'cod' CHECK (payment_method IN ('razorpay', 'stripe', 'phonepe', 'payu', 'paypal', 'cod', 'counter')),
    
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 10. ORDER ITEMS
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    selected_addons JSONB DEFAULT '[]'::jsonb, -- [{group: 'Milk', name: 'Oat Milk', price: 0.75}]
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 11. ORDER STATUS HISTORY (AUDIT & TRACKING)
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    notes TEXT,
    updated_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS TRANSACTION TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway VARCHAR(50) NOT NULL, -- 'razorpay', 'stripe', 'phonepe', 'payu', 'paypal'
    transaction_id VARCHAR(255) UNIQUE,
    gateway_order_id VARCHAR(255),
    gateway_signature VARCHAR(500),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(30) DEFAULT 'initiated' CHECK (status IN ('initiated', 'success', 'failed', 'refunded')),
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_txn ON payments(transaction_id);

-- 13. LOYALTY PROGRAM & REWARDS
CREATE TABLE loyalty_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points_balance INT DEFAULT 0 CHECK (points_balance >= 0),
    lifetime_points INT DEFAULT 0,
    tier VARCHAR(30) DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loyalty_account_id UUID NOT NULL REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points_change INT NOT NULL, -- Positive for earned, negative for redeemed
    reason VARCHAR(100) NOT NULL, -- e.g., 'Order Reward', 'Redemption', 'Signup Bonus'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. REVIEWS & RATINGS
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- 15. SYSTEM SETTINGS & CAFE CONFIGURATION
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AUDIT LOGS FOR SECURITY
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER trigger_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Products & Categories: Anyone can read active products/categories
CREATE POLICY "Public products viewable by everyone" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Public categories viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public reviews viewable by everyone" ON reviews FOR SELECT USING (is_approved = true);

-- Orders: Users can read their own orders; Service role / admin can read all
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own addresses" ON customer_addresses FOR SELECT USING (auth.uid() = user_id);
