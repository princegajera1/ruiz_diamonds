import { Award, ShieldCheck, Gem, Users } from 'lucide-react';
import img3 from '../assets/img_3.jpg';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content fade-in">
          <h1>Our Legacy of <span className="text-gold">Excellence</span></h1>
          <p>Crafting masterpieces since 1995. A journey of passion, purity, and perfection.</p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="brand-story section container">
        <div className="story-grid">
          <div className="story-text">
            <h2 className="section-title" style={{ left: '0', transform: 'none' }}>The Gajera Heritage</h2>
            <p>
              Founded in 1995, GP GOLD began as a small boutique with a grand vision: to create jewellery that not only adorns but also empowers. Over the decades, we have grown into one of India's most trusted luxury jewellery brands, renowned for our uncompromising quality and masterful craftsmanship.
            </p>
            <p>
              Every piece of GP Gold jewellery is a testament to our royal Indian heritage, blended seamlessly with contemporary elegance. We believe that true luxury lies in the details—from the initial sketch to the final polish, our artisans pour their heart and soul into creating heirlooms that will be cherished for generations.
            </p>
          </div>
          <div className="story-image">
            {/* Using one of the generated images for aesthetic purposes */}
            <img src={img3} alt="Craftsmanship" />
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="certifications-section">
        <div className="container">
          <h2 className="section-title">Our Pillars of Trust</h2>
          <div className="pillars-grid">
            <div className="pillar-card">
              <ShieldCheck size={48} className="pillar-icon" />
              <h3>BIS Hallmarked</h3>
              <p>Every gold piece we create undergoes rigorous purity testing and bears the BIS hallmark, guaranteeing the authenticity of 22KT and 18KT gold.</p>
            </div>
            <div className="pillar-card">
              <Gem size={48} className="pillar-icon" />
              <h3>Certified Diamonds</h3>
              <p>Our diamonds are ethically sourced and certified by international laboratories like IGI and SGL for their cut, color, clarity, and carat.</p>
            </div>
            <div className="pillar-card">
              <Award size={48} className="pillar-icon" />
              <h3>Master Craftsmanship</h3>
              <p>Our artisans possess decades of experience, employing both age-old traditional techniques and modern technology to achieve perfection.</p>
            </div>
            <div className="pillar-card">
              <Users size={48} className="pillar-icon" />
              <h3>Customer First</h3>
              <p>We build relationships that last a lifetime, offering transparent pricing, lifetime exchange policies, and exceptional after-sales service.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
