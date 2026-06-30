import { useState, useEffect } from 'react';
import { getDeviceId } from '../utils/deviceId';

function RatingPopup() {
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    const check = () => {
      fetch(`/api/bookings/device/${deviceId}`)
        .then(r => r.json())
        .then(bookings => {
          const unrated = bookings.find(b =>
            b.status === 'completed' && !b.rated
          );
          if (unrated) setBooking(unrated);
        })
        .catch(() => {});
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!rating) return;
    fetch(`/api/bookings/${booking.id}/rate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: rating }),
    })
      .then(r => r.json())
      .then(() => setSubmitted(true))
      .catch(() => {});
  };

  if (!booking || dismissed || submitted) return null;

  return (
    <div className="rating-overlay">
      <div className="rating-card">
        <button className="rating-close" onClick={() => setDismissed(true)}>✕</button>
        <h3 className="rating-title">How was your service?</h3>
        <p className="rating-subtitle">
          Rate your {booking.service} with {booking.assigned_name || 'your barber'}
        </p>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`rating-star ${n <= rating ? 'active' : ''}`}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>
        <button
          className="rating-submit-btn"
          disabled={!rating}
          onClick={handleSubmit}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}

export default RatingPopup;
