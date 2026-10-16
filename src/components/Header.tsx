import "./Header.css";
import { Link } from "react-router-dom";
export function Header() {
  return (
    <header className="site-header">
      {" "}
      <div className="header-container">
        {" "}
        <Link to="/" className="brand">
          {" "}
          <span className="brand-icon">V</span>{" "}
          <span className="brand-name">
            VELOX <small>MARRAKECH</small>{" "}
          </span>{" "}
        </Link>
        <nav className="main-nav">
          <Link to="/fleet">Our Fleet</Link>

          <Link to="/yourReservetions">Reservations</Link>
        </nav>
        <Link to="/fleet" className="header-cta">
          Book a Car <span>↗</span>
        </Link>
      </div>
    </header>
  );
}
