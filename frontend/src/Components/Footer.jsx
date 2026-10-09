import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";



function Footer() {
  return (
    <footer className="timezone-footer">

      <div className="container">

        <div className="row">

          {/* TIMEZONE */}

          <div className="col-md-4 footer-section">

            <h3>TIMEZONE</h3>

            <p>
              TIMEZONE offers stylish and premium watches
              designed for every moment and every style.
            </p>

            <div className="social-icons">

              <a href="#" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>

              <a href="#" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a href="#" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>

              <a href="#" aria-label="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>

            </div>

          </div>


          {/* Quick Links */}

          <div className="col-md-4 footer-section">

            <h4>Quick Links</h4>

            <ul>

              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/products">Products</Link>
              </li>

              <li>
                <Link to="/categories">Categories</Link>
              </li>

              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>

              <li>
                <Link to="/cart">Cart</Link>
              </li>

            </ul>

          </div>


          {/* Contact */}

          <div className="col-md-4 footer-section">

            <h4>Contact Us</h4>

            <p>
              <strong>Email:</strong> support@timezone.com
            </p>

            <p>
              <strong>Phone:</strong> +91 98765 43210
            </p>

            <p>
              <strong>Address:</strong> Madurai, Tamil Nadu, India
            </p>

          </div>

        </div>

      </div>


      {/* Copyright */}

      <div className="footer-bottom">

        <p>
          &copy; 2026 TIMEZONE. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;