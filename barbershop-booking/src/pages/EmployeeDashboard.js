import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('employee');
    if (!data) {
      navigate('/employee/login');
      return;
    }
    setEmployee(JSON.parse(data));
  }, [navigate]);

  useEffect(() => {
    if (!employee) return;
    fetch(`/api/staff/${employee.id}/assignments`)
      .then(r => r.json())
      .then(data => setAssignments(data))
      .catch(() => {});
  }, [employee]);

  const markComplete = (bookingId) => {
    fetch(`/api/bookings/${bookingId}/complete`, { method: 'PUT' })
      .then(r => r.json())
      .then(() => {
        setAssignments(prev => prev.map(b =>
          b.id === bookingId ? { ...b, status: 'completed', completed_at: new Date().toISOString() } : b
        ));
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    sessionStorage.removeItem('employee');
    navigate('/employee/login');
  };

  if (!employee) return null;

  const pendingJobs = assignments.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const doneJobs = assignments.filter(b => b.status === 'completed');

  return (
    <div className="emp-page">
      <div className="emp-header">
        <div>
          <h2 className="emp-title">Welcome, {employee.name}</h2>
          <p className="emp-subtitle">
            Rating: {employee.avg_rating} ★ &nbsp;|&nbsp; Earnings: KSh {employee.total_earnings}
          </p>
        </div>
        <button className="emp-logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {assignments.length === 0 ? (
        <div className="admin-empty">
          <span className="admin-empty-icon">✂️</span>
          <p>No assignments yet</p>
          <span className="admin-empty-sub">Bookings assigned to you will appear here</span>
        </div>
      ) : (
        <>
          {pendingJobs.length > 0 && (
            <section>
              <h3 className="emp-section-title">Upcoming Jobs</h3>
              <div className="emp-cards">
                {pendingJobs.map(b => (
                  <div key={b.id} className="emp-card">
                    <div className="emp-card-body">
                      <span className="emp-card-name">{b.name}</span>
                      <span className="emp-card-service">{b.service}</span>
                      <span className="emp-card-time">{format(new Date(b.date), 'do MMM')} — {b.time}</span>
                      <span className="emp-card-price">{b.price}</span>
                    </div>
                    <button
                      className="emp-done-btn"
                      onClick={() => markComplete(b.id)}
                    >
                      Mark Done
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {doneJobs.length > 0 && (
            <section>
              <h3 className="emp-section-title">Completed</h3>
              <div className="emp-cards">
                {doneJobs.map(b => (
                  <div key={b.id} className="emp-card emp-card-done">
                    <div className="emp-card-body">
                      <span className="emp-card-name">{b.name}</span>
                      <span className="emp-card-service">{b.service}</span>
                      <span className="emp-card-time">{format(new Date(b.date), 'do MMM')} — {b.time}</span>
                      <span className="emp-card-price">{b.price}</span>
                    </div>
                    <span className="emp-done-badge">✓ Done</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default EmployeeDashboard;
