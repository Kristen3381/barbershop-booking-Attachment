import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { name: 'Classic Haircut', price: 'KSh 500', icon: '✂️' },
  { name: 'Fade & Style', price: 'KSh 700', icon: '💈' },
  { name: 'Shave & Trim', price: 'KSh 400', icon: '🪒' },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Look Sharp.<span>Feel Confident.</span>
          </h1>
          <p className="hero-subtitle">
            Premium cuts, clean waves, and hot shaves — tailored to your style.
          </p>
          <button className="hero-btn" onClick={() => navigate('/book')}>
            Book an Appointment
          </button>
        </div>
      </section>

      <section className="services">
        <div className="services-container">
          <h2 className="services-title">Our Services</h2>
          <p className="services-subtitle">Expert grooming for the modern gentleman</p>
          <div className="services-grid">
            {SERVICES.map((service) => (
              <div key={service.name} className="service-card">
                <span className="service-icon">{service.icon}</span>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-price">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;