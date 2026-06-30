import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate('/');
    return null;
  }

  const { name, selectedService, selectedDate, selectedTime } = state;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-check">✓</div>
        <h2 className="confirmation-title">Booking Confirmed!</h2>
        <p className="confirmation-greeting">See you soon, <strong>{name}</strong>!</p>
        <div className="confirmation-details">
          <div className="confirmation-detail-row">
            <span className="detail-label">Service</span>
            <span className="detail-value">{selectedService.name}</span>
          </div>
          <div className="confirmation-detail-row">
            <span className="detail-label">Date</span>
            <span className="detail-value">{format(new Date(selectedDate), 'EEEE, do MMMM yyyy')}</span>
          </div>
          <div className="confirmation-detail-row">
            <span className="detail-label">Time</span>
            <span className="detail-value">{selectedTime}</span>
          </div>
          <div className="confirmation-detail-row">
            <span className="detail-label">Price</span>
            <span className="detail-value">{selectedService.price}</span>
          </div>
        </div>
        <button className="confirmation-back-btn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage;