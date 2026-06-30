const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const bookings = db.prepare(`
    SELECT b.id, b.name, b.service, b.date, b.time, b.price,
           b.status, b.created_at, b.assigned_to, b.barber_id,
           b.device_id, b.completed_at,
           s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    ORDER BY b.created_at DESC
  `).all();
  res.json(bookings);
});

router.post('/', (req, res) => {
  const { name, service, date, time, price, barber_id, device_id } = req.body;
  if (!name || !service || !date || !time || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const stmt = db.prepare(
    'INSERT INTO bookings (name, service, date, time, price, barber_id, assigned_to, device_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const assignedTo = barber_id || null;
  const result = stmt.run(name, service, date, time, price, barber_id || null, assignedTo, device_id || null);
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(booking);
});

router.put('/:id/assign', (req, res) => {
  const { id } = req.params;
  const { assigned_to } = req.body;
  db.prepare('UPDATE bookings SET assigned_to = ? WHERE id = ?').run(assigned_to || null, id);
  const booking = db.prepare(`
    SELECT b.*, s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    WHERE b.id = ?
  `).get(id);
  res.json(booking);
});

router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
  const booking = db.prepare(`
    SELECT b.*, s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    WHERE b.id = ?
  `).get(id);
  res.json(booking);
});

router.put('/:id/complete', (req, res) => {
  const { id } = req.params;
  const now = new Date().toISOString();
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  db.prepare('UPDATE bookings SET status = ?, completed_at = ? WHERE id = ?').run('completed', now, id);

  if (booking.assigned_to) {
    const priceNum = parseFloat(booking.price.replace(/[^0-9.]/g, '')) || 0;
    db.prepare('UPDATE staff SET total_earnings = total_earnings + ? WHERE id = ?')
      .run(priceNum, booking.assigned_to);
  }

  const updated = db.prepare(`
    SELECT b.*, s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    WHERE b.id = ?
  `).get(id);
  res.json(updated);
});

router.put('/:id/rate', (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' });
  }
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.rated) return res.status(400).json({ error: 'Already rated' });

  db.prepare('UPDATE bookings SET rated = 1, rating_value = ? WHERE id = ?').run(value, id);

  if (booking.assigned_to) {
    db.prepare('UPDATE staff SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?')
      .run(value, booking.assigned_to);
    db.prepare('INSERT INTO ratings (booking_id, staff_id, value) VALUES (?, ?, ?)')
      .run(id, booking.assigned_to, value);
  }

  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
  res.json({ ok: true });
});

router.get('/staff', (req, res) => {
  const staff = db.prepare('SELECT * FROM staff ORDER BY name').all();
  res.json(staff);
});

router.get('/device/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const bookings = db.prepare(`
    SELECT b.*, s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    WHERE b.device_id = ?
    ORDER BY b.created_at DESC
  `).all(deviceId);
  res.json(bookings);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const booking = db.prepare(`
    SELECT b.*, s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    WHERE b.id = ?
  `).get(id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  res.json(booking);
});

module.exports = router;
