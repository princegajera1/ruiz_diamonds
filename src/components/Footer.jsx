
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Join the Gajera Family</h3>
              <p>Subscribe to receive updates on new arrivals, special offers and other discount information.</p>
            </div>
            <form className="newsletter-form" action="https://api.web3forms.com/submit" method="POST">
              <input type="hidden" name="access_key" value="b31f5477-33da-4f53-b479-388f0923be95" />
              <input type="hidden" name="subject" value="New GP GOLD Newsletter Subscription" />
              <input type="hidden" name="from_name" value="GP GOLD Website" />
              <input type="email" name="email" placeholder="Your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-main container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-text">GP GOLD</span>
            </Link>
            <p className="brand-desc">
              Crafting timeless elegance and royal heritage. Discover our exclusive collection of BIS Hallmarked gold and certified diamond jewellery.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop?category=Gold">Gold Jewellery</Link></li>
              <li><Link to="/shop?category=Diamond">Diamond Collections</Link></li>
              <li><Link to="/shop?category=Ring">Engagement Rings</Link></li>
              <li><Link to="/shop?category=Earrings">Earrings</Link></li>
              <li><Link to="/shop">All Collections</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/shipping">Shipping Policy</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a href="https://maps.google.com/?q=Mumbai" target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'inherit', textDecoration: 'none'}}>
                  <MapPin size={18} className="contact-icon" style={{ flexShrink: 0, marginTop: '4px' }} />
                  <span>123 Diamond Avenue, Luxury District, Mumbai 400001, India</span>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none'}}>
                  <Phone size={18} className="contact-icon" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a href="mailto:princegajera944@gmail.com" style={{display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit', textDecoration: 'none'}}>
                  <Mail size={18} className="contact-icon" />
                  <span>princegajera944@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} GP GOLD. All Rights Reserved.</p>
          <div className="payment-icons">
            <span>Visa</span>
            <span>MasterCard</span>
            <span>Amex</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
