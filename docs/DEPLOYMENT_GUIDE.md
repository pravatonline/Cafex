# Cafex Deployment & DevOps Guide

This guide covers deploying the full Cafex stack to production:
- **Frontend**: Vercel
- **Backend**: Render (or Railway / AWS / Docker)
- **Database**: Supabase PostgreSQL (Free Tier)
- **Media CDN**: Cloudinary

---

## 1. Supabase PostgreSQL Setup

1. Create a free Supabase project at [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `database/supabase-schema.sql` and run it.
4. Paste the contents of `database/seed-data.sql` and run it to populate initial products, categories, tables, and admin credentials.
5. In **Project Settings** > **Database**, copy your Connection String (URI) and your Supabase URL & Public Anon Key.

---

## 2. Cloudinary Media Storage Setup

1. Create a free Cloudinary account at [https://cloudinary.com](https://cloudinary.com).
2. From the Dashboard, copy:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Media uploads from the Admin dashboard will stream directly to Cloudinary.

---

## 3. Backend Deployment on Render

1. Create an account at [https://render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your Git repository, set the Root Directory to `Cafex/backend`.
4. Configure Build and Start commands:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the following **Environment Variables** in Render:
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
   SUPABASE_KEY=[YOUR_SERVICE_ROLE_OR_ANON_KEY]
   JWT_SECRET=super_secure_jwt_secret_key_cafex_2026_xyz
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-cafex-frontend.vercel.app
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Payment Gateways (Leave test keys for sandbox mode)
   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=xxxx
   STRIPE_SECRET_KEY=sk_test_xxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxx
   PHONEPE_MERCHANT_ID=PGTESTPAYUAT
   PHONEPE_SALT_KEY=xxxx
   PAYU_MERCHANT_KEY=xxxx
   PAYU_MERCHANT_SALT=xxxx
   PAYPAL_CLIENT_ID=sb
   PAYPAL_CLIENT_SECRET=xxxx
   ```

---

## 4. Frontend Deployment on Vercel

1. Create an account at [https://vercel.com](https://vercel.com).
2. Click **Add New...** > **Project** and import your Git repository.
3. Set Root Directory to `Cafex/frontend`.
4. Framework Preset: **Next.js**.
5. Configure Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=sb
   NEXT_PUBLIC_SITE_URL=https://your-cafex-frontend.vercel.app
   ```
6. Click **Deploy**. Vercel will build and launch edge servers worldwide with automatic SSL.

---

## 5. Local Docker Compose Launch

To run the entire platform locally using Docker:
```bash
cd Cafex
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`
