# Cafex REST API Documentation

Base URL: `http://localhost:5000/api` (Production: `https://your-backend.onrender.com/api`)

Authentication is handled via Bearer JWT token in the `Authorization` header:
`Authorization: Bearer <token>`

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/register`
Register a new customer account.
- **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "phone": "+1 555-019-3344"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    }
  }
  ```

### POST `/api/auth/login`
Customer / staff login.
- **Request Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "Password123"
  }
  ```
- **Response (200 OK)**: Returns JWT token and profile.

### POST `/api/auth/admin-login`
Dedicated Administrator login with optional 2FA check.
- **Request Body**:
  ```json
  {
    "email": "admin@cafex.com",
    "password": "Admin@Cafex2026",
    "twoFactorCode": "123456" // Optional if 2FA disabled, required if enabled
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "admin_jwt_token",
    "requires2FA": false,
    "user": {
      "id": "uuid",
      "role": "super_admin",
      "fullName": "Cafex Executive Admin"
    }
  }
  ```

### GET `/api/auth/profile`
Get current user profile, addresses, and loyalty balance.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**

---

## 2. Menu & Categories (`/api/menu`)

### GET `/api/menu/categories`
Fetch all active categories ordered by `display_order`.

### GET `/api/menu/products`
Fetch menu items with filtering and search.
- **Query Parameters**:
  - `category`: category slug or ID
  - `search`: string search across title, description
  - `diet`: `vegan`, `gluten_free`, `dairy_free`, `keto`
  - `featured`: `true` / `false`
  - `sort`: `price_asc`, `price_desc`, `rating`, `popular`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 12,
    "products": [...]
  }
  ```

### GET `/api/menu/products/:slug`
Get single product details with add-ons and reviews.

### POST `/api/menu/products` (Admin Only)
Create new menu item.
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**: Form Data / JSON with product details.

### PUT `/api/menu/products/:id` (Admin Only)
Update product details, pricing, availability.

### DELETE `/api/menu/products/:id` (Admin Only)
Archive or remove product.

---

## 3. Orders & Cart (`/api/orders`)

### POST `/api/orders`
Place a new order.
- **Request Body**:
  ```json
  {
    "orderType": "delivery", // 'delivery' | 'takeaway' | 'dine_in'
    "customer": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1 555-019-3344"
    },
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94107"
    },
    "items": [
      {
        "productId": "p1000000-0000-0000-0000-000000000001",
        "productName": "Cafex Signature Golden Cortado",
        "unitPrice": 4.75,
        "quantity": 2,
        "selectedAddons": [
          { "group": "Milk Option", "name": "Organic Oat Milk", "price": 0.85 }
        ],
        "specialInstructions": "Extra hot please"
      }
    ],
    "couponCode": "WELCOME50",
    "pointsToRedeem": 100,
    "tipAmount": 2.00,
    "paymentMethod": "stripe" // 'stripe' | 'razorpay' | 'phonepe' | 'payu' | 'paypal' | 'cod'
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "order": {
      "id": "uuid",
      "orderNumber": "CFX-2026-8941",
      "totalAmount": 12.35,
      "status": "placed",
      "paymentStatus": "pending"
    },
    "paymentData": { ... }
  }
  ```

### GET `/api/orders/:orderNumber`
Track order status lifecycle in real-time.

### GET `/api/orders/user/my-orders`
List historical orders for authenticated user.

### PATCH `/api/orders/:id/status` (Staff / Admin Only)
Update order status (`confirmed`, `preparing`, `ready`, `out_for_delivery`, `delivered`, `cancelled`).

---

## 4. Multi-Gateway Payments (`/api/payments`)

### POST `/api/payments/create-intent`
Create gateway order/session (Razorpay Order, Stripe PaymentIntent, PhonePe Transaction, PayU Hash, PayPal Order).
- **Request Body**:
  ```json
  {
    "orderId": "uuid",
    "gateway": "razorpay" // or 'stripe', 'phonepe', 'payu', 'paypal'
  }
  ```

### POST `/api/payments/verify`
Verify webhook or client callback payment signature.
- **Request Body**:
  ```json
  {
    "orderId": "uuid",
    "gateway": "razorpay",
    "transactionId": "pay_xxx",
    "gatewayOrderId": "order_xxx",
    "signature": "hmac_signature"
  }
  ```

---

## 5. Table Reservations (`/api/reservations`)

### GET `/api/reservations/availability`
Query available tables and time slots for given date and party size.
- **Query**: `date=2026-11-25&partySize=4`

### POST `/api/reservations`
Book a table reservation.
- **Request Body**:
  ```json
  {
    "customerName": "Robert Frost",
    "customerEmail": "robert@example.com",
    "customerPhone": "+1 555-392-1928",
    "partySize": 4,
    "seatingPreference": "Window",
    "reservationDate": "2026-11-25",
    "reservationTime": "19:00",
    "specialRequests": "Anniversary celebration"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "bookingCode": "RES-2026-4491",
    "status": "confirmed"
  }
  ```

---

## 6. Coupons & Loyalty (`/api/coupons` & `/api/loyalty`)

### POST `/api/coupons/validate`
Validate promo code for cart total and return discount breakdown.

### GET `/api/loyalty/balance`
Fetch current user loyalty tier, points balance, and points redemption value.

---

## 7. Admin Analytics & Management (`/api/admin`)

### GET `/api/admin/analytics/overview`
Returns high-level KPI cards: Daily Revenue, Total Orders, Average Order Value, Customer Growth, and Top Selling Items.

### GET `/api/admin/analytics/sales-chart`
Weekly and monthly sales time-series for dashboard visualization.

### GET `/api/admin/customers`
List customers with total spend, order count, and loyalty tier.
