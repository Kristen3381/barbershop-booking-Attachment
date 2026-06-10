import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}> Shavia Barbershop</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/book" style={styles.bookBtn}>Book Now</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  links: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
  },
  bookBtn: {
    backgroundColor: '#c8a96e',
    color: '#1a1a1a',
    padding: '8px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
  },
};

export default Navbar;