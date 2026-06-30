import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then(r => { if (!r.ok) throw new Error('Incorrect password'); return r.json(); })
      .then(data => {
        sessionStorage.setItem('adminAuth', 'true');
        navigate('/admin');
      })
      .catch(err => {
        if (err.message === 'Failed to fetch') {
          setError('Cannot reach the server. Make sure the backend is running (node server/index.js)');
        } else {
          setError(err.message || 'Server error');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
