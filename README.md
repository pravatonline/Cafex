# Cafex - Enterprise Cafe Management & Online Ordering Platform

> **A production-ready, full-stack, franchise-ready cafe e-commerce platform and management ecosystem.** Built with Next.js 15+, React 19, TypeScript, Tailwind CSS, Express.js, Supabase PostgreSQL, and multi-gateway payment processing.

---

## 🌟 Key Highlights & Features

### ☕ Customer Facing Experience
- **Cinematic Homepage**: Hero animations, quick table reservation widget, Chef's Recommendations, Smart AI Picks, and live opening status.
- **Dynamic Menu & Filters**: Categorized menu (Espresso, Cold Brews, Organic Teas, Artisan Bakery, Gourmet Sandwiches, Açai Bowls), instant dietary filtering (Vegan, Gluten-Free, Dairy-Free, Keto), search, sorting, and item customization modal (milk swaps, sweetness, syrups, extra shots).
- **Product Details & Nutritional Breakdown**: High-resolution gallery, calorie/macro nutrition breakdowns, allergen warnings, customer review distribution, and "Pairs Perfectly With" recommendation engine.
- **Table Reservation System**: Real-time table booking with party size, indoor/patio/window/rooftop seating preferences, date/time pickers, and instant booking codes.
- **Cart & Seamless Checkout**: Slide-out cart drawer, Dine-in / Takeaway / Delivery options, tip calculator, coupon code discount validator, and Cafex Loyalty points redemption.
- **Live Order Tracking**: Real-time progress bar from Order Placed & Kitchen Brewing to Out for Delivery and Completed.
- **Loyalty Program ("Cafex Rewards")**: Tier badges (Bronze, Silver, Gold, Platinum), points accumulation on every dollar spent, and redeemable checkout vouchers.
- **Story, Gallery & Franchise Contact**: Rich brand storytelling, interactive photo gallery with lightbox, location map, and franchise inquiry form.
- **PWA Ready & Dark/Light Mode**: Installable as a Progressive Web App on iOS/Android devices with seamless theme toggling.

### 🛡️ Admin & Kitchen Management Portal (`/admin`)
- **Executive Sales Analytics**: Real-time KPIs (Gross Revenue, Total Orders, Average Order Value, Customer Growth), popular items rankings, and visual charts.
- **Live Kitchen & Order Dispatch System**: Kanban-style / interactive order board with status controls (New, Kitchen In-Progress, Ready, Dispatched, Delivered, Cancelled).
- **Product & Category CRUD**: Live menu manager, price editor, availability toggle, dietary tag flags, and Cloudinary media upload.
- **Customer & Loyalty Directory**: Customer spend profiles, lifetime value, and loyalty tier adjustment.
- **Table Reservation Management**: Accept, confirm, decline, and assign table numbers to customer bookings.
- **Coupons & Promo Engine**: Create percentage or fixed-amount vouchers with minimum order limits, expiry dates, and usage counters.
- **Security & RBAC with 2FA**: Dedicated administrative login endpoint (`/admin/login`), role-based middleware (`customer`, `staff`, `manager`, `admin`, `super_admin`), and optional TOTP Two-Factor Authentication.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15+ App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js, REST API, JSON Web Tokens (JWT), bcryptjs, Helmet, Rate Limiter |
| **Database** | Supabase PostgreSQL (Production Relational Schema with RLS & Triggers) + MongoDB Atlas Alternative |
| **Payments** | Razorpay, Stripe, PhonePe, PayU, PayPal, and Cash on Delivery / Counter |
| **Storage** | Cloudinary CDN for optimized media delivery |
| **DevOps** | Docker, Docker Compose, Vercel (Frontend), Render (Backend) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+ (tested on Node v26)
- **NPM** or **PNPM**
- Optional: **Docker** & **PostgreSQL**

### 2. Backend Setup
```bash
cd Cafex/backend
npm install
cp .env.example .env
npm run dev
# Backend API will run on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Cafex/frontend
npm install
cp .env.example .env.local
npm run dev
# Frontend will run on http://localhost:3000
```

### 4. Default Credentials
- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - **Email**: `admin@cafex.com`
  - **Password**: `Admin@Cafex2026`
- **Customer Demo Account**:
  - **Email**: `customer@example.com`
  - **Password**: `Admin@Cafex2026`

---

## 📂 Project Directory Structure

```text
Cafex/
├── backend/                  # Express REST API Server
│   ├── src/
│   │   ├── config/           # Database, Supabase & payment configs
│   │   ├── controllers/      # Auth, Menu, Orders, Payments, Reservations, Admin
│   │   ├── middlewares/      # JWT auth, RBAC, error handlers, rate limiters
│   │   ├── routes/           # REST endpoints
│   │   ├── services/         # Business logic & payment gateway adapters
│   │   ├── utils/            # JWT helpers, 2FA TOTP, seeds
│   │   └── server.js         # Entrypoint
│   ├── tests/                # Automated API test suite
│   ├── package.json
│   └── Dockerfile
├── frontend/                 # Next.js 15+ App Router Application
│   ├── src/
│   │   ├── app/              # App router pages (Home, Menu, Product, About, Cart, Admin, etc.)
│   │   ├── components/       # UI library, Navbar, Footer, Modals, Admin components
│   │   ├── context/          # Cart, Auth, Theme contexts
│   │   ├── lib/              # API client, utilities, mock data
│   │   └── types/            # TypeScript data contracts
│   ├── public/               # PWA icons, manifest, static assets
│   ├── package.json
│   └── tailwind.config.ts
├── database/                 # SQL schemas, seed scripts & MongoDB models
│   ├── supabase-schema.sql
│   ├── seed-data.sql
│   ├── mongodb-schema.js
│   └── backup-restore.sh
├── docs/                     # Full Technical Documentation
│   ├── ARCHITECTURE_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── TEST_CASES.md
├── docker-compose.yml        # Multi-container orchestration
└── README.md
```
