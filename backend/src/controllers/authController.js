const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { memoryStore, supabase } = require('../config/db');
const { JWT_SECRET } = require('../middlewares/auth');

class AuthController {
  /**
   * Register a new customer
   */
  static async register(req, res, next) {
    try {
      const { fullName, email, password, phone } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
      }

      // Check existing email
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email is already registered. Please log in.' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const newUser = {
        id: `u-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: email.toLowerCase().trim(),
        password_hash,
        full_name: fullName.trim(),
        phone: phone || '',
        role: 'customer',
        is_active: true,
        is_verified: true,
        two_factor_enabled: false,
        two_factor_secret: null,
        created_at: new Date().toISOString()
      };

      memoryStore.users.push(newUser);

      // Initialize loyalty account with 50 welcome points
      memoryStore.loyalty_accounts[newUser.id] = {
        user_id: newUser.id,
        points_balance: 50,
        lifetime_points: 50,
        tier: 'Bronze'
      };

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully! 50 Cafex Welcome Points credited.',
        token,
        user: {
          id: newUser.id,
          fullName: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Customer / standard login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      // Also accept master demo password 'Admin@Cafex2026' for frictionless testing
      const isMasterPass = password === 'Admin@Cafex2026';

      if (!isMatch && !isMasterPass) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const loyalty = memoryStore.loyalty_accounts[user.id] || { points_balance: 0, tier: 'Bronze' };

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          loyalty
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Dedicated Admin Login (/api/auth/admin-login)
   * Enforces Admin/Staff role verification + 2FA support
   */
  static async adminLogin(req, res, next) {
    try {
      const { email, password, twoFactorCode } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
      }

      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Administrative account not found.' });
      }

      // Check role permissions
      const adminRoles = ['admin', 'super_admin', 'manager', 'staff', 'kitchen'];
      if (!adminRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Customer credentials cannot access the administrative portal.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      const isMasterPass = password === 'Admin@Cafex2026';

      if (!isMatch && !isMasterPass) {
        return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
      }

      // If 2FA is active on this account, verify TOTP token
      if (user.two_factor_enabled && user.two_factor_secret) {
        if (!twoFactorCode) {
          return res.status(200).json({
            success: false,
            requires2FA: true,
            message: 'Two-Factor Authentication code required.'
          });
        }

        const verified = speakeasy.totp.verify({
          secret: user.two_factor_secret,
          encoding: 'base32',
          token: twoFactorCode,
          window: 2
        });

        if (!verified) {
          return res.status(401).json({ success: false, message: 'Invalid 2FA code. Please check your authenticator app.' });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Admin authorization granted.',
        token,
        requires2FA: false,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: user.two_factor_enabled
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Setup 2FA for Admin
   */
  static async setup2FA(req, res, next) {
    try {
      const user = memoryStore.users.find(u => u.id === req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      const secret = speakeasy.generateSecret({
        name: `Cafex Admin (${user.email})`
      });

      user.two_factor_temp_secret = secret.base32;

      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      res.status(200).json({
        success: true,
        secret: secret.base32,
        qrCodeUrl,
        message: 'Scan this QR code with Google Authenticator or Authy to enable 2FA.'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Confirm and activate 2FA
   */
  static async verifyAndEnable2FA(req, res, next) {
    try {
      const { code } = req.body;
      const user = memoryStore.users.find(u => u.id === req.user.id);
      if (!user || !user.two_factor_temp_secret) {
        return res.status(400).json({ success: false, message: '2FA setup was not initiated.' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.two_factor_temp_secret,
        encoding: 'base32',
        token: code,
        window: 2
      });

      if (!verified) {
        return res.status(400).json({ success: false, message: 'Invalid verification code.' });
      }

      user.two_factor_secret = user.two_factor_temp_secret;
      user.two_factor_enabled = true;
      delete user.two_factor_temp_secret;

      res.status(200).json({
        success: true,
        message: 'Two-Factor Authentication successfully enabled for your account!'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Current Authenticated Profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = memoryStore.users.find(u => u.id === req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      const loyalty = memoryStore.loyalty_accounts[user.id] || {
        points_balance: 0,
        lifetime_points: 0,
        tier: 'Bronze'
      };

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          twoFactorEnabled: user.two_factor_enabled,
          loyalty
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
