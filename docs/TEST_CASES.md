# Cafex QA & Test Cases Suite

## 1. Automated Test Plan

Cafex includes automated Jest/Supertest integration and unit tests covering:
- Auth & RBAC access restrictions
- Order placement with cart calculations, tax, discounts, and tips
- Coupon engine validation and usage capping
- Reservation availability verification
- Multi-gateway payment intent creation & signature verification

---

## 2. Test Cases Matrix

| Test ID | Module | Description | Input / Precondition | Expected Result | Status |
|---|---|---|---|---|---|
| **TC-AUTH-01** | Auth | Customer Registration | Valid email, strong password, full name | User created, JWT token returned, 201 status | PASS |
| **TC-AUTH-02** | Auth | Duplicate Email Check | Existing email | 400 Bad Request: "Email already registered" | PASS |
| **TC-AUTH-03** | Auth | Admin Login Without 2FA | Valid Admin credentials (2FA disabled) | 200 OK with admin role token | PASS |
| **TC-AUTH-04** | Auth | Admin Login With 2FA | Valid Admin credentials + 6-digit TOTP code | 200 OK with admin role token | PASS |
| **TC-AUTH-05** | RBAC | Customer Accessing Admin Routes | Customer Bearer token to `/api/admin/*` | 403 Forbidden: "Insufficient permissions" | PASS |
| **TC-MENU-01** | Menu | Dietary Flag Filtering | Query `diet=vegan` | Only items with `dietary_flags.is_vegan = true` returned | PASS |
| **TC-MENU-02** | Menu | Search & Category Sorting | Category = "artisan-coffee", sort="price_asc" | Correct products sorted by price low to high | PASS |
| **TC-ORD-01** | Orders | Order Calculation & Placed | Cart with 2 items, $5 flat coupon, 8.5% tax | Accurate mathematical subtotal, discount, tax, total | PASS |
| **TC-ORD-02** | Orders | Real-time Lifecycle Tracking | Status update `preparing` -> `ready` | Order tracking endpoint reflects new status with timestamp | PASS |
| **TC-RES-01** | Booking | Table Reservation Conflict | 2 bookings requesting same table/slot | Second booking politely suggested alternative time slot | PASS |
| **TC-PAY-01** | Payment | Razorpay Intent Creation | Valid order ID | Razorpay order ID and currency returned | PASS |
| **TC-PAY-02** | Payment | Stripe PaymentIntent Creation | Valid order ID | Stripe Client Secret generated | PASS |
| **TC-CPN-01** | Coupon | Min Order Amount Gate | Cart subtotal $12, Coupon requires $20 | 400 Bad Request: "Minimum order $20 required" | PASS |
| **TC-LOY-01** | Loyalty | Points Earning & Redemption | $50 order completed | Points credited to user loyalty account balance | PASS |
