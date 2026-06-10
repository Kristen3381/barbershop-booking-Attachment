import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import TimeSlot from '../components/TimeSlot';

const SERVICES = [
  { id: 1, name: 'Clean shave', duration: '30 min', price: 'KSh 200' },
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
      <h2>Book Your Appointment</h2>

      {/*Services by Shavia*/}
      <section>
        <h3>1. Choose a Service</h3>
        {SERVICES.map(service => (
          <div
            key={service.id}
            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
            onClick={() => setSelectedService(service)}
          >
            <strong>{service.name}</strong>
            <span>{service.duration}</span>
            <span>{service.price}</span>
          </div>
        ))}
      </section>

      {/*  Choose Date */}
      <section>
        <h3>2. Choose a Date</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
        />
        <p>Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
      </section>

      {/* Choose Time */}
      <section>
        <h3>3. Choose a Time</h3>
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
      </section>

      {/* Your Name */}
      <section>
        <h3>4. Your Name</h3>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </section>

      <button onClick={handleSubmit}>Confirm booking</button>
    </div>
  );
}

export default BookingPage;