const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/admin-login', authLimiter, AuthController.adminLogin);

router.get('/profile', verifyToken, AuthController.getProfile);
router.post('/2fa/setup', verifyToken, AuthController.setup2FA);
router.post('/2fa/verify', verifyToken, AuthController.verifyAndEnable2FA);

module.exports = router;
