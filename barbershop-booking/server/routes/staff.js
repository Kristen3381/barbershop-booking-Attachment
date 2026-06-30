const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const staff = db.prepare(`
    SELECT id, name, on_leave, rating_sum, rating_count,
           total_earnings, created_at,
           CASE WHEN rating_count > 0 THEN ROUND(rating_sum / rating_count, 1) ELSE 0 END AS avg_rating
    FROM staff ORDER BY name
  `).all();
  const { date, time } = req.query;
  const checkDate = date || new Date().toISOString().split('T')[0];
  for (const s of staff) {
    let query = `SELECT COUNT(*) AS cnt FROM bookings WHERE assigned_to = ? AND status = 'confirmed' AND date = ?`;
    const params = [s.id, checkDate];
    if (time) {
      query += ` AND time = ?`;
      params.push(time);
    }
    const activeJob = db.prepare(query).get(...params);
    s.has_client = activeJob.cnt > 0;
  }
  res.json(staff);
});

router.post('/', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'Name and password required' });
  }
  const existing = db.prepare('SELECT id FROM staff WHERE name = ?').get(name);
  if (existing) {
    return res.status(409).json({ error: 'Staff member already exists' });
  }
  const result = db.prepare('INSERT INTO staff (name, password) VALUES (?, ?)').run(name, password);
  const staff = db.prepare('SELECT id, name, on_leave FROM staff WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(staff);
});

router.post('/login', (req, res) => {
  const { name, password } = req.body;
  const staff = db.prepare('SELECT * FROM staff WHERE name = ? AND password = ?').get(name, password);
  if (!staff) {
    return res.status(401).json({ error: 'Invalid name or password' });
  }
  res.json({
    id: staff.id,
    name: staff.name,
    on_leave: staff.on_leave,
    avg_rating: staff.rating_count > 0
      ? Math.round(staff.rating_sum / staff.rating_count * 10) / 10
      : 0,
    total_earnings: staff.total_earnings,
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, password, on_leave } = req.body;
  if (name !== undefined) db.prepare('UPDATE staff SET name = ? WHERE id = ?').run(name, id);
  if (password !== undefined) db.prepare('UPDATE staff SET password = ? WHERE id = ?').run(password, id);
  if (on_leave !== undefined) db.prepare('UPDATE staff SET on_leave = ? WHERE id = ?').run(on_leave ? 1 : 0, id);
  const staff = db.prepare('SELECT id, name, on_leave FROM staff WHERE id = ?').get(id);
  res.json(staff);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM staff WHERE id = ?').run(id);
  res.json({ ok: true });
});

router.get('/:id/assignments', (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  let query = `
    SELECT b.*, s.name AS assigned_name
    FROM bookings b
    LEFT JOIN staff s ON s.id = b.assigned_to
    WHERE b.assigned_to = ?`;
  const params = [id];
  if (date) {
    query += ' AND b.date = ?';
    params.push(date);
  }
  query += ' ORDER BY b.date DESC, b.time ASC';
  const bookings = db.prepare(query).all(...params);
  res.json(bookings);
});

module.exports = router;
