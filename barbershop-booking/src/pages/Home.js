import { useNavigate } from 'react-router-dom';

const SERVICES = [
  {
    name: 'Classic Haircut',
    price: 'KSh 500',
    img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop&auto=format',
  },
  {
    name: 'Fade & Style',
    price: 'KSh 700',
    img: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&h=300&fit=crop&auto=format',
  },
  {
    name: 'Shave & Trim',
    price: 'KSh 400',
    img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=300&fit=crop&auto=format',
  },
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
          <h2 className="services-title">Our services</h2>
          <p className="services-subtitle">Expert grooming for the modern gentleman</p>
          <div className="services-grid">
            {SERVICES.map((service) => (
              <div key={service.name} className="service-card">
                <img className="service-card-img" src={service.img} alt={service.name} loading="lazy" />
                <div className="service-card-body">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-price">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
