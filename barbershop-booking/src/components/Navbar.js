import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Shavia Salon</Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/book" className="navbar-book-btn">Book Now</Link>
      </div>
    </nav>
  );
}

export default Navbar;