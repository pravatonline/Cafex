/**
 * CAFEX - MONGODB ATLAS ALTERNATIVE SCHEMA & MONGOOSE MODELS
 * Enterprise Cafe Management & Online Ordering Platform
 * Provides complete NoSQL schema parity with PostgreSQL/Supabase.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. User & Auth Schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  avatarUrl: { type: String },
  role: { 
    type: String, 
    enum: ['customer', 'staff', 'kitchen', 'manager', 'admin', 'super_admin'], 
    default: 'customer' 
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
  addresses: [{
    label: { type: String, default: 'Home' },
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartmentSuite: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

UserSchema.index({ email: 1, role: 1 });

// 2. Category Schema
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  imageUrl: { type: String },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 3. Product Schema
const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  basePrice: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  sku: { type: String, unique: true },
  imageUrl: { type: String, required: true },
  secondaryImages: [String],
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isChefSpecial: { type: Boolean, default: false },
  preparationTimeMinutes: { type: Number, default: 10 },
  calories: { type: Number },
  dietaryFlags: {
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isDairyFree: { type: Boolean, default: false },
    isKeto: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: true }
  },
  nutritionFacts: {
    fat: String,
    carbs: String,
    protein: String,
    sugar: String
  },
  allergens: [String],
  roastLevel: { type: String, enum: ['Light', 'Medium', 'Medium-Dark', 'Dark', null] },
  ratingAvg: { type: Number, default: 5.0, min: 1, max: 5 },
  ratingCount: { type: Number, default: 0 },
  customizationGroups: [{
    groupName: { type: String, required: true },
    isMultiple: { type: Boolean, default: false },
    isRequired: { type: Boolean, default: false },
    options: [{
      name: { type: String, required: true },
      priceDelta: { type: Number, default: 0 },
      isDefault: { type: Boolean, default: false }
    }]
  }]
}, { timestamps: true });

ProductSchema.index({ slug: 1, category: 1, isAvailable: 1, isFeatured: 1 });

// 4. Order Schema
const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  orderType: { 
    type: String, 
    enum: ['delivery', 'takeaway', 'dine_in'], 
    default: 'delivery' 
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled'],
    default: 'placed'
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  tableNumber: { type: String },
  deliveryAddress: {
    street: String,
    apartment: String,
    city: String,
    state: String,
    postalCode: String,
    landmark: String
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    selectedAddons: [{
      group: String,
      name: String,
      price: Number
    }],
    specialInstructions: String
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    tipAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  couponCode: { type: String },
  loyaltyPoints: {
    redeemed: { type: Number, default: 0 },
    earned: { type: Number, default: 0 }
  },
  payment: {
    gateway: { type: String, enum: ['razorpay', 'stripe', 'phonepe', 'payu', 'paypal', 'cod', 'counter'], default: 'cod' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    gatewayOrderId: String,
    paidAt: Date
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: String
  }],
  estimatedTime: Date
}, { timestamps: true });

OrderSchema.index({ orderNumber: 1, user: 1, status: 1, createdAt: -1 });

// 5. Reservation Schema
const ReservationSchema = new Schema({
  bookingCode: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  seatingPreference: { type: String, enum: ['Indoor', 'Patio', 'Window', 'Rooftop', 'Private Lounge'], default: 'Indoor' },
  reservationDate: { type: String, required: true }, // YYYY-MM-DD
  reservationTime: { type: String, required: true }, // HH:mm
  tableNumber: { type: String },
  specialRequests: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  adminNotes: { type: String }
}, { timestamps: true });

// 6. Review Schema
const ReviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// 7. Coupon Schema
const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  isFirstOrderOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Category: mongoose.model('Category', CategorySchema),
  Product: mongoose.model('Product', ProductSchema),
  Order: mongoose.model('Order', OrderSchema),
  Reservation: mongoose.model('Reservation', ReservationSchema),
  Review: mongoose.model('Review', ReviewSchema),
  Coupon: mongoose.model('Coupon', CouponSchema)
};
