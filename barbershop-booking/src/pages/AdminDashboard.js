import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const STAFF = [
  { id: 1, name: 'James Mwangi' },
  { id: 2, name: 'Peter Kamau' },
  { id: 3, name: 'Kevin Ochieng' },
  { id: 4, name: 'Brian Otieno' },
];

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('shaviaBookings');
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  const assignStaff = (bookingId, staffName) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, assignedTo: staffName } : b
    );
    setBookings(updated);
    localStorage.setItem('shaviaBookings', JSON.stringify(updated));
  };

  const updateStatus = (bookingId, status) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status } : b
    );
    setBookings(updated);
    localStorage.setItem('shaviaBookings', JSON.stringify(updated));
  };

  const deleteBooking = (bookingId) => {
    const updated = bookings.filter(b => b.id !== bookingId);
    setBookings(updated);
    localStorage.setItem('shaviaBookings', JSON.stringify(updated));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Admin Dashboard</h2>
        <p className="admin-subtitle">Manage bookings and assign staff</p>
      </div>

      {bookings.length === 0 ? (
        <div className="admin-empty">
          <span className="admin-empty-icon">📋</span>
          <p>No bookings yet</p>
          <span className="admin-empty-sub">Customer bookings will appear here</span>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="admin-cell-name">{b.name}</td>
                  <td>{b.service}</td>
                  <td>{format(new Date(b.date), 'do MMM yyyy')}</td>
                  <td>{b.time}</td>
                  <td className="admin-cell-price">{b.price}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={b.assignedTo || ''}
                      onChange={e => assignStaff(b.id, e.target.value)}
                    >
                      <option value="">— Unassigned —</option>
                      {STAFF.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${b.status || 'pending'}`}>
                      {b.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-cell-actions">
                      <select
                        className="admin-select admin-select-sm"
                        value={b.status || 'pending'}
                        onChange={e => updateStatus(b.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        className="admin-delete-btn"
                        onClick={() => deleteBooking(b.id)}
                        title="Delete booking"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
