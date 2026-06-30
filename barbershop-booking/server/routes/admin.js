const express = require('express');
const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false, error: 'Invalid password' });
});

router.get('/stats', (req, res) => {
  const db = require('../db');

  const totalRevenue = db.prepare(
    `SELECT SUM(CAST(REPLACE(REPLACE(price, 'KSh ', ''), ',', '') AS REAL)) AS total
     FROM bookings WHERE status = 'completed'`
  ).get();

  const bookingCounts = db.prepare(`
    SELECT status, COUNT(*) AS count FROM bookings GROUP BY status
  `).all();

  const barberStats = db.prepare(`
    SELECT s.id, s.name, s.on_leave, s.total_earnings,
           s.rating_sum, s.rating_count,
           CASE WHEN s.rating_count > 0 THEN ROUND(s.rating_sum / s.rating_count, 1) ELSE 0 END AS avg_rating,
           (SELECT COUNT(*) FROM bookings b WHERE b.assigned_to = s.id AND b.status = 'completed') AS jobs_completed
    FROM staff s ORDER BY avg_rating DESC
  `).all();

  const recentBookings = db.prepare(`
    SELECT b.id, b.name, b.service, b.date, b.time, b.price, b.status,
           s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    ORDER BY b.created_at DESC LIMIT 10
  `).all();

  res.json({
    totalRevenue: totalRevenue.total || 0,
    bookingCounts,
    barberStats,
    recentBookings,
  });
});

module.exports = router;
