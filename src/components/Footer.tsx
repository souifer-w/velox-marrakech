import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      {" "}
      <div className="footer-container">
        {" "}
        <div className="footer-brand">
          {" "}
          <a href="/" className="footer-logo">
            VELOX<span>.</span>{" "}
          </a>{" "}
          <p>
            Exceptional cars. Exceptional journeys. <br />
            Discover Marrakech in style.{" "}
          </p>{" "}
        </div>
        ```
        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#fleet">Our Fleet</a>
          <a href="#experience">Our Experience</a>
          <a href="#services">Our Services</a>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href="mailto:contact@veloxmarrakech.com">Email Us</a>
          <span>Marrakech, Morocco</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} VELOX Marrakech. All rights reserved.
        </p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
