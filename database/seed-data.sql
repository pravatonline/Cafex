-- ==============================================================================
-- CAFEX - SEED DATA SCRIPT FOR SUPABASE POSTGRESQL
-- Initial master data: Categories, Menu Items, Add-ons, Tables, Coupons & Settings
-- Default admin credentials: admin@cafex.com / Admin@Cafex2026 (bcrypt hash included)
-- ==============================================================================

-- 1. Insert Initial Categories
INSERT INTO categories (id, name, slug, description, icon, image_url, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Artisan Coffee', 'artisan-coffee', 'Single origin pour-overs, handcrafted espressos, and silky lattes brewed to perfection.', 'Coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80', 1),
('c1000000-0000-0000-0000-000000000002', 'Cold Brew & Nitro', 'cold-brew-nitro', 'Slow-steeped for 18 hours, smooth, naturally sweet and refreshingly energizing.', 'Zap', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80', 2),
('c1000000-0000-0000-0000-000000000003', 'Organic Teas & Infusions', 'organic-teas', 'Handpicked loose leaf herbal botanicals, ceremonial matcha, and rare floral blends.', 'Feather', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80', 3),
('c1000000-0000-0000-0000-000000000004', 'Artisan Bakery & Pastries', 'bakery-pastries', 'Baked fresh every morning using cultured European butter and stoneground flour.', 'Cake', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80', 4),
('c1000000-0000-0000-0000-000000000005', 'Gourmet Sandwiches & Toast', 'gourmet-sandwiches', 'Toasted sourdough, house-cured meats, creamy avocado, and artisanal cheeses.', 'Sandwich', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80', 5),
('c1000000-0000-0000-0000-000000000006', 'Superfood Bowls & Salads', 'superfood-bowls', 'Nutrient-rich açai bowls, quinoa harvest greens, and wholesome vibrant plates.', 'Leaf', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', 6),
('c1000000-0000-0000-0000-000000000007', 'Decadent Desserts', 'decadent-desserts', 'Velvety tiramisu, molten chocolate lava cake, and seasonal fruit tarts.', 'PieChart', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', 7)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Menu Items / Products
INSERT INTO products (id, category_id, name, slug, description, short_description, base_price, sale_price, sku, image_url, is_featured, is_chef_special, preparation_time_minutes, calories, dietary_flags, nutrition_facts, allergens, roast_level, rating_avg, rating_count) VALUES
-- Artisan Coffee
('p1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Cafex Signature Golden Cortado', 'signature-golden-cortado', 'Double shot of Ethiopian Yirgacheffe espresso balanced with textured microfoam milk and a touch of raw organic wildflower honey with dusted cinnamon.', 'Rich double shot espresso with honey and velvety textured steamed milk.', 5.25, 4.75, 'CFX-COF-001', 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80', true, true, 5, 120, '{"is_vegan": false, "is_gluten_free": true, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "4g", "carbs": "12g", "protein": "5g", "sugar": "9g"}', '["Dairy"]', 'Medium', 4.95, 142),
('p1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Single Origin Ethiopian V60 Pour-Over', 'ethiopian-v60-pour-over', 'Hand-poured single estate heirloom beans featuring delicate jasmine aromas, vibrant bergamot acidity, and a crisp peach finish.', 'Bright floral notes of jasmine, bergamot, and sweet stone fruit.', 6.50, NULL, 'CFX-COF-002', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', true, false, 7, 5, '{"is_vegan": true, "is_gluten_free": true, "is_dairy_free": true, "is_keto": true, "is_vegetarian": true}', '{"fat": "0g", "carbs": "0g", "protein": "0g", "sugar": "0g"}', '[]', 'Light', 4.90, 88),
('p1000000-0000-0000-0000-0000000000013', 'c1000000-0000-0000-0000-000000000001', 'Smoked Sea Salt Caramel Flat White', 'smoked-sea-salt-caramel-flat-white', 'Ristretto shots paired with house-made smoked salted caramel syrup and dense silky microfoam.', 'Indulgent caramel sweetness with savory Pacific sea salt accent.', 5.75, NULL, 'CFX-COF-003', 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&auto=format&fit=crop&q=80', true, true, 5, 210, '{"is_vegan": false, "is_gluten_free": true, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "8g", "carbs": "28g", "protein": "6g", "sugar": "22g"}', '["Dairy"]', 'Medium-Dark', 4.88, 114),

-- Cold Brew & Nitro
('p1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Velvet Nitro Cold Brew', 'velvet-nitro-cold-brew', 'Infused with nitrogen gas on tap for a creamy stout-like cascading head, chocolatey body, and velvety mouthfeel without milk.', 'Naturally creamy, low-acidity draft nitro with dark cacao notes.', 5.95, NULL, 'CFX-CLD-001', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80', true, true, 3, 10, '{"is_vegan": true, "is_gluten_free": true, "is_dairy_free": true, "is_keto": true, "is_vegetarian": true}', '{"fat": "0g", "carbs": "1g", "protein": "1g", "sugar": "0g"}', '[]', 'Dark', 4.92, 203),
('p1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Madagascar Vanilla Sweet Cream Cold Brew', 'madagascar-vanilla-cold-brew', 'Slow-steeped cold brew poured over block ice and topped with a luscious layer of house-whipped vanilla sweet cream.', 'Cascading sweet cream over crisp dark roast cold brew.', 6.25, 5.75, 'CFX-CLD-002', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80', true, false, 4, 185, '{"is_vegan": false, "is_gluten_free": true, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "9g", "carbs": "21g", "protein": "3g", "sugar": "18g"}', '["Dairy"]', 'Dark', 4.87, 160),

-- Organic Teas & Infusions
('p1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000003', 'Ceremonial Uji Matcha Latte', 'ceremonial-uji-matcha-latte', 'First-harvest shade-grown green tea powder from Uji, Kyoto whisked traditionally with creamy steamed oat milk.', 'Vibrant green, rich in antioxidants, earthy and naturally sweet.', 6.50, NULL, 'CFX-TEA-001', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80', true, true, 5, 140, '{"is_vegan": true, "is_gluten_free": true, "is_dairy_free": true, "is_keto": false, "is_vegetarian": true}', '{"fat": "3.5g", "carbs": "18g", "protein": "4g", "sugar": "10g"}', '["Oats"]', NULL, 4.96, 310),
('p1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'Masala Spiced Botanical Chai', 'masala-spiced-botanical-chai', 'Slow-simmered Assam black tea with crushed green cardamom, Ceylon cinnamon, cloves, ginger root and organic brown sugar.', 'Aromatic traditional spiced chai with warming spices.', 5.50, NULL, 'CFX-TEA-002', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80', false, false, 5, 160, '{"is_vegan": false, "is_gluten_free": true, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "4g", "carbs": "24g", "protein": "5g", "sugar": "20g"}', '["Dairy"]', NULL, 4.79, 95),

-- Bakery & Pastries
('p1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004', 'French Butter Pain au Chocolat', 'french-butter-pain-au-chocolat', 'Laminated croissant dough layered with double batons of 70% Valrhona dark chocolate, baked golden with crispy flakiness.', 'Crisp flaky pastry with rich melted dark French chocolate.', 4.95, NULL, 'CFX-BAK-001', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80', true, false, 2, 340, '{"is_vegan": false, "is_gluten_free": false, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "18g", "carbs": "38g", "protein": "6g", "sugar": "14g"}', '["Wheat", "Dairy", "Soy"]', NULL, 4.91, 178),
('p1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004', 'Almond Frangipane Twice-Baked Croissant', 'almond-frangipane-croissant', 'Croissant infused with orange blossom syrup, stuffed with rich almond cream, and generously coated with toasted sliced almonds.', 'Decadent twice-baked pastry coated in roasted almonds and icing sugar.', 5.50, NULL, 'CFX-BAK-002', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', false, true, 2, 420, '{"is_vegan": false, "is_gluten_free": false, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "24g", "carbs": "44g", "protein": "9g", "sugar": "19g"}', '["Wheat", "Dairy", "Almonds", "Eggs"]', NULL, 4.94, 134),

-- Gourmet Sandwiches & Toast
('p1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000005', 'Truffled Prosciutto & Burrata Sourdough Panini', 'truffled-prosciutto-burrata-panini', 'Crispy grilled sourdough stuffed with 24-month aged Parma prosciutto, fresh Pugliese burrata, wild arugula, and black truffle drizzle.', 'Melted burrata, savory prosciutto, and white truffle glaze on sourdough.', 12.95, 11.50, 'CFX-SND-001', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80', true, true, 12, 580, '{"is_vegan": false, "is_gluten_free": false, "is_dairy_free": false, "is_keto": false, "is_vegetarian": false}', '{"fat": "28g", "carbs": "52g", "protein": "31g", "sugar": "3g"}', '["Wheat", "Dairy"]', NULL, 4.98, 260),
('p1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000005', 'Haas Avocado & Pistachio Dukkah Toast', 'avocado-pistachio-dukkah-toast', 'Thick-cut multigrain sourdough topped with crushed Hass avocado, sheep milk feta, heirloom cherry tomatoes, and Egyptian pistachio dukkah.', 'Creamy avocado on toasted artisanal loaf with crumbly feta and seeds.', 9.75, NULL, 'CFX-SND-002', 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&auto=format&fit=crop&q=80', true, false, 8, 380, '{"is_vegan": false, "is_gluten_free": false, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "22g", "carbs": "36g", "protein": "11g", "sugar": "4g"}', '["Wheat", "Dairy", "Tree Nuts"]', NULL, 4.85, 192),

-- Superfood Bowls & Salads
('p1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000006', 'Amazonian Organic Açai Super Bowl', 'amazonian-organic-acai-bowl', 'Wild frozen açai pureed with bananas and almond milk, topped with organic granola, chia seeds, goji berries, shaved coconut and raw honey.', 'Frosty organic antioxidant bowl topped with tropical fruits and crunch.', 10.50, NULL, 'CFX-BWL-001', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80', true, false, 6, 340, '{"is_vegan": true, "is_gluten_free": true, "is_dairy_free": true, "is_keto": false, "is_vegetarian": true}', '{"fat": "9g", "carbs": "62g", "protein": "6g", "sugar": "32g"}', '["Almonds", "Coconut"]', NULL, 4.93, 215),

-- Decadent Desserts
('p1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000007', 'Espresso-Infused Treviso Tiramisu', 'espresso-infused-treviso-tiramisu', 'Savoiardi ladyfingers soaked in our signature espresso and dark rum, layered with whipped mascarpone cream and dusted with Dutch cocoa.', 'Authentic Italian classic soaked with fresh espresso and velvety cream.', 7.95, NULL, 'CFX-DST-001', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80', true, true, 4, 450, '{"is_vegan": false, "is_gluten_free": false, "is_dairy_free": false, "is_keto": false, "is_vegetarian": true}', '{"fat": "24g", "carbs": "48g", "protein": "7g", "sugar": "30g"}', '["Wheat", "Dairy", "Eggs"]', NULL, 4.97, 340)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Product Add-ons
INSERT INTO product_addons (product_id, group_name, name, price_delta, is_default, is_multiple) VALUES
(NULL, 'Milk Option', 'Whole Dairy Milk', 0.00, true, false),
(NULL, 'Milk Option', 'Organic Oat Milk', 0.85, false, false),
(NULL, 'Milk Option', 'Almond Milk', 0.85, false, false),
(NULL, 'Milk Option', 'Coconut Milk', 0.85, false, false),
(NULL, 'Syrups & Flavors', 'House Madagascar Vanilla (+1 pump)', 0.75, false, true),
(NULL, 'Syrups & Flavors', 'Smoked Caramel (+1 pump)', 0.75, false, true),
(NULL, 'Syrups & Flavors', 'Sugar-Free Hazelnut (+1 pump)', 0.75, false, true),
(NULL, 'Espresso Boost', 'Extra Ristretto Shot', 1.25, false, true),
(NULL, 'Espresso Boost', 'Decaf Bean Swap', 0.50, false, false),
(NULL, 'Size Selection', 'Regular (12 oz)', 0.00, true, false),
(NULL, 'Size Selection', 'Large (16 oz)', 0.85, false, false),
(NULL, 'Size Selection', 'Jumbo (20 oz)', 1.50, false, false)
ON CONFLICT DO NOTHING;

-- 4. Insert Cafe Tables
INSERT INTO cafe_tables (table_number, capacity, section, status) VALUES
('T-01', 2, 'Window', 'available'),
('T-02', 2, 'Window', 'available'),
('T-03', 4, 'Indoor', 'available'),
('T-04', 4, 'Indoor', 'available'),
('T-05', 6, 'Indoor', 'available'),
('T-06', 4, 'Patio', 'available'),
('T-07', 4, 'Patio', 'available'),
('T-08', 2, 'Patio', 'available'),
('T-09', 8, 'Private Lounge', 'available'),
('T-10', 4, 'Rooftop', 'available'),
('T-11', 4, 'Rooftop', 'available')
ON CONFLICT (table_number) DO NOTHING;

-- 5. Insert Promo Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_first_order_only, is_active) VALUES
('WELCOME50', 'Enjoy 50% off on your first order up to $10!', 'percentage', 50.00, 15.00, 10.00, 1000, true, true),
('CAFEDAY20', 'Flat 20% discount on all artisan brews and bakery treats', 'percentage', 20.00, 20.00, 15.00, NULL, false, true),
('FLAT5OFF', 'Save $5 off any gourmet order over $25', 'fixed', 5.00, 25.00, NULL, 500, false, true),
('FREESHIP', 'Free delivery on orders above $30', 'fixed', 3.99, 30.00, NULL, NULL, false, true)
ON CONFLICT (code) DO NOTHING;

-- 6. Insert Default Admin User
-- Password: Admin@Cafex2026 (hashed using bcrypt cost 10: $2a$10$w6D4cI96Nf0f.j4xK6E2eeb7yvF8QfW7HlDk2RzP3bIuKlmwQ4Q3W)
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active, is_verified) VALUES
('u0000000-0000-0000-0000-000000000001', 'admin@cafex.com', '$2a$10$tZ2y0mE1zU9vS/eB57j7mO1gYhL27z/m3L1Gz648oJ8L1K7P0.w3S', 'Cafex Executive Admin', '+1 555-019-2831', 'super_admin', true, true),
('u0000000-0000-0000-0000-000000000002', 'customer@example.com', '$2a$10$tZ2y0mE1zU9vS/eB57j7mO1gYhL27z/m3L1Gz648oJ8L1K7P0.w3S', 'Sarah Jenkins', '+1 555-019-8822', 'customer', true, true)
ON CONFLICT (email) DO NOTHING;

-- 7. Insert Initial Loyalty Account for Customer
INSERT INTO loyalty_accounts (user_id, points_balance, lifetime_points, tier) VALUES
('u0000000-0000-0000-0000-000000000002', 250, 480, 'Silver')
ON CONFLICT (user_id) DO NOTHING;

-- 8. Insert System Settings
INSERT INTO system_settings (key, value, description) VALUES
('cafe_general', '{"cafe_name": "Cafex Artisan Roastery & Bistro", "tagline": "Crafted with passion, roasted to perfection.", "phone": "+1 (555) 749-2831", "email": "hello@cafex.com", "address": "742 Evergreen Terrace, Downtown Tech District, San Francisco, CA 94107", "currency": "USD", "currency_symbol": "$"}'::jsonb, 'General cafe profile info'),
('operating_hours', '{"monday_friday": "06:30 AM - 09:00 PM", "saturday": "07:30 AM - 10:00 PM", "sunday": "08:00 AM - 08:00 PM"}'::jsonb, 'Weekly operating schedules'),
('order_rules', '{"tax_rate_percent": 8.5, "delivery_base_fee": 3.99, "free_delivery_threshold": 35.00, "estimated_prep_minutes": 15, "delivery_radius_km": 10}'::jsonb, 'Order processing calculation rules'),
('payment_gateways', '{"razorpay_enabled": true, "stripe_enabled": true, "phonepe_enabled": true, "payu_enabled": true, "paypal_enabled": true, "cod_enabled": true}'::jsonb, 'Active payment providers')
ON CONFLICT (key) DO NOTHING;

-- 9. Insert Sample Customer Reviews
INSERT INTO reviews (product_id, reviewer_name, rating, title, comment, is_verified_purchase, is_approved) VALUES
('p1000000-0000-0000-0000-000000000001', 'Marcus Vance', 5, 'Best Cortado in the entire city!', 'The honey and cinnamon balance is sensational. Rich espresso crema with silky foam. Will order every morning!', true, true),
('p1000000-0000-0000-0000-000000000003', 'Elena Rostova', 5, 'Nitro cold brew is ultra-smooth', 'No dairy needed at all, the nitrogen texture gives it a thick stout finish and zero bitterness. 10/10.', true, true),
('p1000000-0000-0000-0000-000000000009', 'David Chen', 5, 'Burrata sourdough perfection', 'The truffle drizzle combined with fresh burrata and crisp prosciutto is an absolute culinary triumph.', true, true)
ON CONFLICT DO NOTHING;
