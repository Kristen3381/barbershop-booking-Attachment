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
        <h2>Booking Confirmed!</h2>
        <p>See you soon <strong>{name}</strong>!</p>
        <div className="booking-details">
          <p><span>Service:</span> {selectedService.name}</p>
          <p><span>Date:</span> {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</p>
          <p><span>Time:</span> {selectedTime}</p>
          <p><span>Price:</span> {selectedService.price}</p>
        </div>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
}

export default ConfirmationPage;