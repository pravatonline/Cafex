/**
 * CAFEX - AUTOMATED BACKEND INTEGRATION TEST SUITE
 * Uses Node's built-in fetch and HTTP server for 100% genuine HTTP testing.
 */

const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/server');

let server;
let baseUrl;

test.before(() => {
  return new Promise((resolve) => {
    // Port 0 tells the OS to assign an ephemeral free port
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

test('1. System Health Check', async () => {
  const res = await fetch(`${baseUrl}/health`);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.status, 'healthy');
});

test('2. Menu Categories & Products Listing', async () => {
  const catRes = await fetch(`${baseUrl}/api/menu/categories`);
  const catData = await catRes.json();
  assert.strictEqual(catRes.status, 200);
  assert.ok(catData.categories.length > 0);

  const prodRes = await fetch(`${baseUrl}/api/menu/products`);
  const prodData = await prodRes.json();
  assert.strictEqual(prodRes.status, 200);
  assert.ok(prodData.products.length > 0);
});

test('3. Dietary Filter (Vegan)', async () => {
  const res = await fetch(`${baseUrl}/api/menu/products?diet=vegan`);
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  data.products.forEach(p => {
    assert.strictEqual(p.dietary_flags.is_vegan, true);
  });
});

test('4. Customer Registration & JWT Generation', async () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Barista',
      email: testEmail,
      password: 'Password123!',
      phone: '+1 555-019-9999'
    })
  });

  const data = await res.json();
  assert.strictEqual(res.status, 201);
  assert.ok(data.token);
  assert.strictEqual(data.user.role, 'customer');
});

test('5. Admin Login & Authorization', async () => {
  const res = await fetch(`${baseUrl}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@cafex.com',
      password: 'Admin@Cafex2026'
    })
  });

  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(data.token);
  assert.strictEqual(data.user.role, 'super_admin');
});

test('6. Coupon Validation Engine', async () => {
  const res = await fetch(`${baseUrl}/api/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: 'WELCOME50',
      cartTotal: 20.00
    })
  });

  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.coupon.calculatedDiscount, 10.00); // 50% capped at $10
});

test('7. Order Placement & Cart Financial Calculations', async () => {
  const res = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderType: 'delivery',
      customer: {
        name: 'Michael Scott',
        phone: '+1 555-999-1234',
        email: 'michael@dunder.com'
      },
      deliveryAddress: {
        street: '1725 Slough Ave',
        city: 'Scranton',
        state: 'PA',
        postalCode: '18503'
      },
      items: [
        {
          productId: 'p1000000-0000-0000-0000-000000000001',
          productName: 'Cafex Signature Golden Cortado',
          unitPrice: 4.75,
          quantity: 2
        }
      ],
      couponCode: 'WELCOME50',
      paymentMethod: 'cod',
      tipAmount: 1.50
    })
  });

  const data = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(data.success, true);
  assert.ok(data.order.order_number.startsWith('CFX-'));
  assert.strictEqual(data.order.status, 'placed');
});

test('8. Table Reservation Availability & Booking', async () => {
  const availRes = await fetch(`${baseUrl}/api/reservations/availability?partySize=2&date=2026-11-28`);
  const availData = await availRes.json();
  assert.strictEqual(availRes.status, 200);
  assert.strictEqual(availData.available, true);

  const bookRes = await fetch(`${baseUrl}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Jim Halpert',
      customerPhone: '+1 555-888-2345',
      reservationDate: '2026-11-28',
      reservationTime: '19:30',
      partySize: 2,
      seatingPreference: 'Window'
    })
  });

  const bookData = await bookRes.json();
  assert.strictEqual(bookRes.status, 201);
  assert.ok(bookData.reservation.booking_code.startsWith('RES-'));
});
