const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'shavia.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL DEFAULT 'staff123',
    on_leave INTEGER NOT NULL DEFAULT 0,
    rating_sum REAL NOT NULL DEFAULT 0,
    rating_count INTEGER NOT NULL DEFAULT 0,
    total_earnings REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    price TEXT NOT NULL,
    barber_id INTEGER,
    assigned_to INTEGER,
    device_id TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    rated INTEGER NOT NULL DEFAULT 0,
    rating_value INTEGER,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (barber_id) REFERENCES staff(id),
    FOREIGN KEY (assigned_to) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    value INTEGER NOT NULL CHECK(value >= 1 AND value <= 5),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
  );
`);

const staffCount = db.prepare('SELECT COUNT(*) AS cnt FROM staff').get();
if (staffCount.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO staff (name, password, on_leave) VALUES (?, ?, ?)'
  );
  const members = [
    ['James Mwangi', 'staff123', 0],
    ['Peter Kamau', 'staff123', 0],
    ['Kevin Ochieng', 'staff123', 0],
    ['Brian Otieno', 'staff123', 1],
  ];
  for (const [name, password, on_leave] of members) {
    insert.run(name, password, on_leave);
  }
}

module.exports = db;
