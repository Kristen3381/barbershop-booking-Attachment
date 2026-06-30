import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import TimeSlot from '../components/TimeSlot';

const SERVICES = [
  { id: 1, name: 'Classic Haircut', duration: '30 min', price: 'KSh 500', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop&auto=format' },
  { id: 2, name: 'Fade & Style', duration: '45 min', price: 'KSh 700', img: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&h=300&fit=crop&auto=format' },
  { id: 3, name: 'Shave & Trim', duration: '20 min', price: 'KSh 400', img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=300&fit=crop&auto=format' },
];

const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];

const STEPS = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Date' },
  { num: 3, label: 'Time' },
  { num: 4, label: 'Confirm' },
];

function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const canProceed = () => {
    if (step === 1) return selectedService;
    if (step === 2) return true;
    if (step === 3) return selectedTime;
    if (step === 4) return name.trim();
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) {
      alert('Please complete this step before continuing');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

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

      <div className="booking-progress">
        {STEPS.map(s => (
          <div key={s.num} className={`progress-step ${s.num === step ? 'active' : ''} ${s.num < step ? 'done' : ''}`}>
            <div className="progress-circle">{s.num < step ? '✓' : s.num}</div>
            <span className="progress-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="booking-step-content">
        {step === 1 && (
          <div className="step-panel">
            <div className="step-panel-header">
              <span className="step-panel-icon">💇</span>
              <h3 className="step-panel-title">Choose a Service</h3>
              <p className="step-panel-desc">Select the service you need</p>
            </div>
            <div className="service-options">
              {SERVICES.map(service => (
                <div
                  key={service.id}
                  className={`service-option ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <img className="service-option-img" src={service.img} alt={service.name} loading="lazy" />
                  <div className="service-option-body">
                    <div className="service-option-name">{service.name}</div>
                    <div className="service-option-detail">{service.duration}</div>
                    <span className="service-option-price">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-panel">
            <div className="step-panel-header">
              <span className="step-panel-icon">📅</span>
              <h3 className="step-panel-title">Choose a Date</h3>
              <p className="step-panel-desc">Pick a day that works for you</p>
            </div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
            />
            <p className="selected-date">{format(selectedDate, 'EEEE, do MMMM yyyy')}</p>
          </div>
        )}

        {step === 3 && (
          <div className="step-panel">
            <div className="step-panel-header">
              <span className="step-panel-icon">⏰</span>
              <h3 className="step-panel-title">Choose a Time</h3>
              <p className="step-panel-desc">Select your preferred slot</p>
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
        )}

        {step === 4 && (
          <div className="step-panel">
            <div className="step-panel-header">
              <span className="step-panel-icon">✍️</span>
              <h3 className="step-panel-title">Almost Done</h3>
              <p className="step-panel-desc">Enter your name to confirm</p>
            </div>
            <div className="booking-summary">
              <div className="summary-row">
                <span className="summary-label">Service</span>
                <span className="summary-value">{selectedService?.name || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Date</span>
                <span className="summary-value">{format(selectedDate, 'do MMMM yyyy')}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Time</span>
                <span className="summary-value">{selectedTime || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Price</span>
                <span className="summary-value summary-price">{selectedService?.price || '—'}</span>
              </div>
            </div>
            <input
              className="name-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="booking-actions">
        {step > 1 && (
          <button className="booking-back" onClick={handleBack}>
            Back
          </button>
        )}
        <div className="booking-actions-spacer" />
        {step < 4 ? (
          <button className="booking-next" onClick={handleNext}>
            Continue
          </button>
        ) : (
          <button className="booking-submit" onClick={handleSubmit}>
            Confirm Booking
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingPage;