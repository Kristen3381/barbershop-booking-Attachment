import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import TimeSlot from '../components/TimeSlot';

const SERVICES = [
  { id: 1, name: 'Clean Shave', duration: '30 min', price: 'KSh 200' },
  { id: 2, name: 'Waves', duration: '45 min', price: 'KSh 500' },
  { id: 3, name: 'Shave & Trim', duration: '20 min', price: 'KSh 400' },
];

const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];

function BookingPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!selectedService || !selectedTime || !name) {
      alert('Please fill in all fields');
      return;
    }
    navigate('/confirmation', {
      state: { name, selectedService, selectedDate, selectedTime }
    });
  };

  return (
    <div className="booking-page">
      <h2 className="booking-title">Book Your Appointment</h2>
      <p className="booking-subtitle">Choose your service, date, and time</p>

      <div className="booking-step">
        <div className="booking-step-header">
          <span className="step-number">1</span>
          <h3 className="step-label">Choose a Service</h3>
        </div>
        <div className="service-options">
          {SERVICES.map(service => (
            <div
              key={service.id}
              className={`service-option ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => setSelectedService(service)}
            >
              <div className="service-option-name">{service.name}</div>
              <div className="service-option-detail">{service.duration}</div>
              <span className="service-option-price">{service.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="booking-step">
        <div className="booking-step-header">
          <span className="step-number">2</span>
          <h3 className="step-label">Choose a Date</h3>
        </div>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
        />
        <p className="selected-date">Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className="booking-step">
        <div className="booking-step-header">
          <span className="step-number">3</span>
          <h3 className="step-label">Choose a Time</h3>
        </div>
        <div className="time-slots">
          {TIME_SLOTS.map(slot => (
            <TimeSlot
              key={slot}
              time={slot}
              isSelected={selectedTime === slot}
              onSelect={setSelectedTime}
            />
          ))}
        </div>
      </div>

      <div className="booking-step">
        <div className="booking-step-header">
          <span className="step-number">4</span>
          <h3 className="step-label">Your Name</h3>
        </div>
        <input
          className="name-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button className="booking-submit" onClick={handleSubmit}>
        Confirm Booking
      </button>
    </div>
  );
}

export default BookingPage;