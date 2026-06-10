import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Look Sharp.<br />Feel Confident.</h1>
        <p style={styles.subtitle}>
          Premium cuts, clean fades, and hot shaves.
        </p>
        <button style={styles.btn} onClick={() => navigate('/book')}>
          Book an Appointment
        </button>
      </div>

      <div style={styles.services}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <div style={styles.cards}>
          {[
            { name: 'Classic Haircut', price: 'KSh 500', icon: '✂️' },
            { name: 'Fade & Style', price: 'KSh 700', icon: '💈' },
            { name: 'Shave & Trim', price: 'KSh 400', icon: '🪒' },
          ].map((service) => (
            <div key={service.name} style={styles.card}>
              <span style={styles.icon}>{service.icon}</span>
              <h3 style={styles.cardTitle}>{service.name}</h3>
              <p style={styles.cardPrice}>{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 32px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  },
  title: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '24px',
    color: '#c8a96e',
  },
  subtitle: {
    fontSize: '18px',
    color: '#aaa',
    maxWidth: '480px',
    marginBottom: '40px',
    lineHeight: '1.7',
  },
  btn: {
    backgroundColor: '#c8a96e',
    color: '#1a1a1a',
    border: 'none',
    padding: '16px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
    letterSpacing: '1px',
  },
  services: {
    padding: '80px 32px',
    backgroundColor: '#111',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '48px',
    color: '#c8a96e',
  },
  cards: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#2d2d2d',
    borderRadius: '8px',
    padding: '40px 32px',
    textAlign: 'center',
    width: '220px',
    border: '1px solid #333',
  },
  icon: {
    fontSize: '40px',
  },
  cardTitle: {
    fontSize: '18px',
    margin: '16px 0 8px',
    color: 'white',
  },
  cardPrice: {
    color: '#c8a96e',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default Home;