import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page container section">
      <div className="page-header text-center">
        <h1 className="section-title">Get in Touch</h1>
        <p className="subtitle">We're here to assist you with any queries regarding our collections, custom designs, or services.</p>
      </div>

      <div className="contact-layout">
        {/* Contact Info */}
        <div className="contact-info-panel">
          <h3>Contact Information</h3>
          <p className="info-desc">Reach out to us through any of the channels below or visit our flagship store.</p>
          
          <div className="info-items">
            <div className="info-item">
              <div className="icon-wrapper">
                <MapPin size={24} />
              </div>
              <div className="item-text">
                <h4>Visit Our Store</h4>
                <p>123 Diamond Avenue, Luxury District,<br />Mumbai, Maharashtra 400001, India</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <Phone size={24} />
              </div>
              <div className="item-text">
                <h4>Call Us</h4>
                <p>
                  <a href="tel:+919876543210" style={{color:'inherit', textDecoration:'none'}}>+91 98765 43210</a><br />
                  <a href="tel:02223456789" style={{color:'inherit', textDecoration:'none'}}>022-2345-6789</a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <Mail size={24} />
              </div>
              <div className="item-text">
                <h4>Email Us</h4>
                <p>
                  <a href="mailto:info@gpgold.com" style={{color:'inherit', textDecoration:'none'}}>info@gpgold.com</a><br />
                  <a href="mailto:support@gpgold.com" style={{color:'inherit', textDecoration:'none'}}>support@gpgold.com</a>
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <Clock size={24} />
              </div>
              <div className="item-text">
                <h4>Store Hours</h4>
                <p>Monday - Saturday: 10:30 AM - 8:30 PM<br />Sunday: 11:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>

          <div className="whatsapp-cta">
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="btn btn-primary w-100 whatsapp-btn-large">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="wa-icon" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-panel">
          <h3>Send us a Message</h3>
          <form className="enquiry-form" action="https://api.web3forms.com/submit" method="POST">
            {/* Replace this value with your actual Web3Forms Access Key */}
            <input type="hidden" name="access_key" value="b31f5477-33da-4f53-b479-388f0923be95" />
            <input type="hidden" name="subject" value="New GP GOLD Contact Enquiry" />
            <input type="hidden" name="from_name" value="GP GOLD Website" />
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="First Name" placeholder="John" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="Last Name" placeholder="Doe" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="Email" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="Phone" placeholder="+91 98765 43210" required />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select name="Subject" required>
                <option value="">Select a subject...</option>
                <option value="product">Product Enquiry</option>
                <option value="custom">Custom Design Request</option>
                <option value="order">Order Status</option>
                <option value="appointment">Book an Appointment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea name="Message" rows="5" placeholder="How can we help you?" required></textarea>
            </div>

            <button type="submit" className="btn btn-primary submit-btn">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section mt-5">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120651.1013437583!2d72.78463378311317!3d19.091158156108163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1714820000000!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
          style={{ border: 0, borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
