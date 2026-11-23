const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');
const { verifyToken, optionalToken } = require('../middlewares/auth');
const { verifyRole } = require('../middlewares/rbac');

// Customer endpoints
router.get('/availability', ReservationController.checkAvailability);
router.post('/', optionalToken, ReservationController.bookReservation);
router.get('/:code', ReservationController.getReservation);

// Admin endpoints
router.get('/admin/all', verifyToken, verifyRole(['admin', 'super_admin', 'manager', 'staff']), ReservationController.getAllReservationsAdmin);
router.patch('/admin/:id', verifyToken, verifyRole(['admin', 'super_admin', 'manager']), ReservationController.updateReservationStatusAdmin);

module.exports = router;
