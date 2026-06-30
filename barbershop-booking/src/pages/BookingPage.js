import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import TimeSlot from '../components/TimeSlot';
import { getDeviceId } from '../utils/deviceId';

const SERVICES = [
  { id: 1, name: 'Classic Haircut', duration: '30 min', price: 'KSh 500', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop&auto=format' },
  { id: 2, name: 'Fade & Style', duration: '45 min', price: 'KSh 700', img: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&h=300&fit=crop&auto=format' },
  { id: 3, name: 'Shave & Trim', duration: '20 min', price: 'KSh 400', img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=300&fit=crop&auto=format' },
  { id: 0, name: 'Other Service', duration: 'Flexible', price: '', img: '' },
];

const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];

const STEPS = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Date' },
  { num: 3, label: 'Time' },
  { num: 4, label: 'Barber' },
  { num: 5, label: 'Confirm' },
];

function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [name, setName] = useState('');
  const [customServiceDesc, setCustomServiceDesc] = useState('');
  const [customServicePrice, setCustomServicePrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    if (dateStr) params.set('date', dateStr);
    if (selectedTime) params.set('time', selectedTime);
    fetch(`/api/staff?${params.toString()}`)
      .then(r => r.json())
      .then(data => setBarbers(data.filter(b => !b.on_leave)))
      .catch(() => {});
  }, [selectedDate, selectedTime]);

  const canProceed = () => {
    if (step === 1) {
      if (!selectedService) return false;
      if (selectedService.id === 0) return customServiceDesc.trim().length > 0;
      return true;
    }
    if (step === 2) return true;
    if (step === 3) return !!selectedTime;
    if (step === 4) return true;
    if (step === 5) return name.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) {
      alert('Please complete this step before continuing');
      return;
    }
    setStep(s => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const getServiceName = () => {
    if (!selectedService) return '';
    if (selectedService.id === 0) return customServiceDesc.trim();
    return selectedService.name;
  };

  const getServicePrice = () => {
    if (!selectedService) return '';
    if (selectedService.id === 0) return customServicePrice.trim() || 'TBD';
    return selectedService.price;
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedTime || !name) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    setSubmitError('');

    const serviceName = getServiceName();
    const servicePrice = getServicePrice();

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        service: serviceName,
        date: selectedDate.toISOString(),
        time: selectedTime,
        price: servicePrice,
        barber_id: selectedBarber || null,
        device_id: getDeviceId(),
      }),
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to save booking');
        return r.json();
      })
      .then(() => {
        navigate('/confirmation', {
          state: {
            name,
            selectedService: {
              ...selectedService,
              name: serviceName,
              price: servicePrice,
            },
            selectedDate,
            selectedTime,
            selectedBarber,
          },
        });
      })
      .catch(() => {
        setSubmitError('Something went wrong. Please try again.');
        setSubmitting(false);
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
                  {service.img ? (
                    <img className="service-option-img" src={service.img} alt={service.name} loading="lazy" />
                  ) : (
                    <div className="service-option-img service-option-img-placeholder">✂️</div>
                  )}
                  <div className="service-option-body">
                    <div className="service-option-name">{service.name}</div>
                    <div className="service-option-detail">{service.duration}</div>
                    {service.price && <span className="service-option-price">{service.price}</span>}
                  </div>
                </div>
              ))}
            </div>
            {selectedService?.id === 0 && (
              <div className="custom-service-fields">
                <input
                  className="login-input"
                  type="text"
                  placeholder="Describe the service you want"
                  value={customServiceDesc}
                  onChange={e => setCustomServiceDesc(e.target.value)}
                />
                <input
                  className="login-input"
                  type="text"
                  placeholder="Price (e.g. KSh 600)"
                  value={customServicePrice}
                  onChange={e => setCustomServicePrice(e.target.value)}
                />
              </div>
            )}
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
              <span className="step-panel-icon">✂️</span>
              <h3 className="step-panel-title">Choose a Barber</h3>
              <p className="step-panel-desc">Pick your preferred barber (optional)</p>
            </div>
            <div className="barber-options">
              <div
                className={`barber-option ${!selectedBarber ? 'selected' : ''}`}
                onClick={() => setSelectedBarber(null)}
              >
                <div className="barber-option-avatar">🤷</div>
                <div className="barber-option-name">No preference</div>
                <div className="barber-option-detail">Anyone available</div>
              </div>
              {barbers.map(b => (
                <div
                  key={b.id}
                  className={`barber-option ${selectedBarber === b.id ? 'selected' : ''} ${b.has_client ? 'barber-unavailable' : ''}`}
                  onClick={() => !b.has_client && setSelectedBarber(b.id)}
                >
                  <div className="barber-option-avatar">💈</div>
                  <div className="barber-option-name">{b.name}</div>
                  <div className="barber-option-detail">
                    {b.has_client ? 'Booked' : b.avg_rating > 0 ? `${b.avg_rating} ★` : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-panel">
            <div className="step-panel-header">
              <span className="step-panel-icon">✍️</span>
              <h3 className="step-panel-title">Almost Done</h3>
              <p className="step-panel-desc">Review and confirm your booking</p>
            </div>
            <div className="booking-summary">
              <div className="summary-row">
                <span className="summary-label">Service</span>
                <span className="summary-value">{getServiceName() || '—'}</span>
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
                <span className="summary-label">Barber</span>
                <span className="summary-value">
                  {selectedBarber ? barbers.find(b => b.id === selectedBarber)?.name || '—' : 'No preference'}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Price</span>
                <span className="summary-value summary-price">{getServicePrice() || '—'}</span>
              </div>
            </div>
            <input
              className="name-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {submitError && <p className="booking-error">{submitError}</p>}
          </div>
        )}
      </div>

      <div className="booking-actions">
        {step > 1 && (
          <button className="booking-back" onClick={handleBack} disabled={submitting}>
            Back
          </button>
        )}
        <div className="booking-actions-spacer" />
        {step < STEPS.length ? (
          <button className="booking-next" onClick={handleNext}>
            Continue
          </button>
        ) : (
          <button className="booking-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
