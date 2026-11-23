const jwt = require('jsonwebtoken');
const { memoryStore, supabase } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cafex_jwt_key_2026_production_grade';

/**
 * Verifies Bearer JWT token from Authorization header
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user details
    let user = memoryStore.users.find(u => u.id === decoded.id);

    if (!user && supabase) {
      const { data } = await supabase.from('users').select('*').eq('id', decoded.id).single();
      user = data;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User account no longer exists.'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token authentication failed.' });
  }
};

/**
 * Optional token extraction (doesn't fail if anonymous)
 */
const optionalToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = memoryStore.users.find(u => u.id === decoded.id);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        };
      }
    } catch {
      // Ignore token decode errors for optional auth
    }
  }
  next();
};

module.exports = {
  verifyToken,
  optionalToken,
  JWT_SECRET
};
