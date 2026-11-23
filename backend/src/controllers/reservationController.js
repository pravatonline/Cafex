const { memoryStore } = require('../config/db');

class ReservationController {
  /**
   * Check Table Availability for a given date and party size
   */
  static async checkAvailability(req, res, next) {
    try {
      const { date, partySize, section } = req.query;

      const size = Number(partySize) || 2;
      let tables = memoryStore.tables.filter(t => t.capacity >= size && t.status === 'available');

      if (section && section !== 'any') {
        tables = tables.filter(t => t.section.toLowerCase() === section.toLowerCase());
      }

      // Generate standard cafe reservation slots
      const availableSlots = [
        '08:00', '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '20:30'
      ];

      res.status(200).json({
        success: true,
        available: tables.length > 0,
        matchingTablesCount: tables.length,
        slots: availableSlots,
        sections: ['Indoor', 'Window', 'Patio', 'Rooftop', 'Private Lounge']
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Book a new table reservation
   */
  static async bookReservation(req, res, next) {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        partySize,
        seatingPreference = 'Indoor',
        reservationDate,
        reservationTime,
        specialRequests
      } = req.body;

      if (!customerName || !customerPhone || !reservationDate || !reservationTime || !partySize) {
        return res.status(400).json({
          success: false,
          message: 'Customer name, phone, reservation date, time, and party size are required.'
        });
      }

      const bookingCode = `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Assign matching table
      const assignedTable = memoryStore.tables.find(
        t => t.capacity >= Number(partySize) &&
          (seatingPreference === 'any' || t.section.toLowerCase() === seatingPreference.toLowerCase())
      ) || memoryStore.tables[0];

      const newReservation = {
        id: `res-${Date.now()}`,
        booking_code: bookingCode,
        user_id: req.user ? req.user.id : null,
        customer_name: customerName,
        customer_email: customerEmail || 'guest@example.com',
        customer_phone: customerPhone,
        party_size: Number(partySize),
        seating_preference: seatingPreference,
        table_number: assignedTable ? assignedTable.table_number : 'Assigned at arrival',
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        special_requests: specialRequests || '',
        status: 'confirmed',
        created_at: new Date().toISOString()
      };

      memoryStore.reservations.unshift(newReservation);

      res.status(201).json({
        success: true,
        message: 'Table reserved successfully! Confirmation sent to your contact details.',
        reservation: newReservation
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Reservation details by booking code
   */
  static async getReservation(req, res, next) {
    try {
      const { code } = req.params;
      const reservation = memoryStore.reservations.find(
        r => r.booking_code.toLowerCase() === code.toLowerCase() || r.id === code
      );

      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found.' });
      }

      res.status(200).json({
        success: true,
        reservation
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: List all reservations
   */
  static async getAllReservationsAdmin(req, res, next) {
    try {
      const { status, date } = req.query;
      let reservations = [...memoryStore.reservations];

      if (status && status !== 'all') {
        reservations = reservations.filter(r => r.status === status);
      }

      if (date) {
        reservations = reservations.filter(r => r.reservation_date === date);
      }

      res.status(200).json({
        success: true,
        count: reservations.length,
        reservations
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Update reservation status
   */
  static async updateReservationStatusAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { status, tableNumber, adminNotes } = req.body;

      const reservation = memoryStore.reservations.find(r => r.id === id || r.booking_code === id);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found.' });
      }

      if (status) reservation.status = status;
      if (tableNumber) reservation.table_number = tableNumber;
      if (adminNotes) reservation.admin_notes = adminNotes;

      res.status(200).json({
        success: true,
        message: 'Reservation updated successfully.',
        reservation
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReservationController;
