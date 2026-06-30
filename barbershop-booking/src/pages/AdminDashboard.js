import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('bookings');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPass, setNewStaffPass] = useState('');
  const [staffMsg, setStaffMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchAll();
  }, [navigate]);

  const fetchAll = () => {
    fetch('/api/bookings').then(r => r.json()).then(setBookings).catch(() => {});
    fetch('/api/staff').then(r => r.json()).then(setStaff).catch(() => {});
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
  };

  const assignStaff = (bookingId, staffId) => {
    fetch(`/api/bookings/${bookingId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_to: staffId || null }),
    })
      .then(r => r.json())
      .then(updated => {
        setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      })
      .catch(() => {});
  };

  const updateStatus = (bookingId, status) => {
    fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(r => r.json())
      .then(updated => {
        setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
        fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
      })
      .catch(() => {});
  };

  const deleteBooking = (bookingId) => {
    fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
      .then(() => {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {});
      })
      .catch(() => {});
  };

  const addStaff = (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPass) return;
    fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newStaffName, password: newStaffPass }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setStaffMsg(data.error);
        } else {
          setStaffMsg(`Added ${data.name}`);
          setNewStaffName('');
          setNewStaffPass('');
          fetch('/api/staff').then(r => r.json()).then(setStaff).catch(() => {});
        }
      })
      .catch(() => setStaffMsg('Error adding staff'));
  };

  const toggleLeave = (staffId, current) => {
    fetch(`/api/staff/${staffId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ on_leave: current ? 0 : 1 }),
    })
      .then(r => r.json())
      .then(() => {
        fetch('/api/staff').then(r => r.json()).then(setStaff).catch(() => {});
      })
      .catch(() => {});
  };

  const deleteStaff = (staffId) => {
    fetch(`/api/staff/${staffId}`, { method: 'DELETE' })
      .then(() => {
        fetch('/api/staff').then(r => r.json()).then(setStaff).catch(() => {});
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const canAssign = (s) => {
    if (s.on_leave) return false;
    return true;
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Dashboard</h2>
          <p className="admin-subtitle">Manage bookings, staff, and track performance</p>
        </div>
        <button className="emp-logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={`admin-tab ${tab === 'staff' ? 'active' : ''}`} onClick={() => setTab('staff')}>Staff</button>
        <button className={`admin-tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>Stats</button>
      </div>

      {tab === 'bookings' && (
        <>
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
                          value={b.assigned_to || ''}
                          onChange={e => assignStaff(b.id, Number(e.target.value))}
                        >
                          <option value="">— Unassigned —</option>
                          {staff.filter(canAssign).map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name}{s.has_client ? ' (busy)' : ''}
                            </option>
                          ))}
                          {staff.filter(s => !canAssign(s)).map(s => (
                            <option key={s.id} value={s.id} disabled>
                              {s.name} (on leave)
                            </option>
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
                          >✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'staff' && (
        <div className="admin-staff-section">
          <div className="admin-staff-form">
            <h3 className="admin-staff-form-title">Register New Employee</h3>
            <form onSubmit={addStaff} className="admin-staff-form-row">
              <input
                className="login-input"
                type="text"
                placeholder="Full name"
                value={newStaffName}
                onChange={e => setNewStaffName(e.target.value)}
              />
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={newStaffPass}
                onChange={e => setNewStaffPass(e.target.value)}
              />
              <button className="login-btn" type="submit">Add</button>
            </form>
            {staffMsg && <p className="admin-staff-msg">{staffMsg}</p>}
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Earnings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id}>
                    <td className="admin-cell-name">{s.name}</td>
                    <td>{s.avg_rating > 0 ? `${s.avg_rating} ★` : 'No ratings'}</td>
                    <td className="admin-cell-price">KSh {s.total_earnings}</td>
                    <td>
                      {s.on_leave ? (
                        <span className="admin-badge admin-badge-cancelled">On Leave</span>
                      ) : s.has_client ? (
                        <span className="admin-badge admin-badge-confirmed">With Client</span>
                      ) : (
                        <span className="admin-badge admin-badge-completed">Available</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-cell-actions">
                        <button
                          className={`admin-toggle-btn ${s.on_leave ? 'off' : ''}`}
                          onClick={() => toggleLeave(s.id, s.on_leave)}
                        >
                          {s.on_leave ? 'Restore' : 'Set Leave'}
                        </button>
                        <button
                          className="admin-delete-btn"
                          onClick={() => deleteStaff(s.id)}
                          title="Remove staff"
                        >✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="admin-stats">
          <div className="stats-cards">
            <div className="stat-card">
              <span className="stat-value">KSh {stats.totalRevenue.toLocaleString()}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            {stats.bookingCounts && stats.bookingCounts.map(bc => (
              <div key={bc.status} className="stat-card">
                <span className="stat-value">{bc.count}</span>
                <span className="stat-label">{bc.status} bookings</span>
              </div>
            ))}
          </div>

          <h3 className="admin-stats-title">Barber Rankings</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Barber</th>
                  <th>Rating</th>
                  <th>Jobs Done</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {stats.barberStats && stats.barberStats.map((s, i) => (
                  <tr key={s.id}>
                    <td className="admin-cell-rank">{i + 1}</td>
                    <td className="admin-cell-name">{s.name}</td>
                    <td>
                      <span className="admin-badge admin-badge-completed">
                        {s.avg_rating > 0 ? `${s.avg_rating} ★` : '—'}
                      </span>
                    </td>
                    <td>{s.jobs_completed}</td>
                    <td className="admin-cell-price">KSh {s.total_earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
