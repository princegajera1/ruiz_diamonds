import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Gem, Truck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import header1 from '../assets/header1.jpg';
import header2 from '../assets/header2.jpg';
import header3 from '../assets/header3.jpg';
import header4 from '../assets/header4.jpg';
import r1 from '../assets/Rings1.jpg';
import n1 from '../assets/Gold Necklaces1.jpg';
import e1 from '../assets/Earrings1.jpg';
import dj1 from '../assets/Diamond Jewelry1.jpg';
import r2 from '../assets/Rings2.jpg';
import n2 from '../assets/Gold Necklaces2.jpg';
import e2 from '../assets/Earrings2.jpg';
import dj2 from '../assets/Diamond Jewelry2.jpg';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useOrders } from '../context/OrderContext';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products } = useProducts();
  const navigate = useNavigate();
  
  const heroSlides = [
    { image: header1, link: '/shop?category=Gold' },
    { image: header3, link: '/shop?category=Diamond' },
    { image: header4, link: '/shop?category=Ring' },
    { image: header2, link: '/shop?category=Earrings' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const { trackVisitor } = useOrders();

  useEffect(() => {
    trackVisitor();
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);
  const collections = [
    { id: 1, title: "Gold Rings", image: r1 },
    { id: 2, title: "Necklaces", image: n1 },
    { id: 3, title: "Earrings", image: e1 },
    { id: 4, title: "Diamond Jewelry", image: dj1 }
  ];

  const newArrivals = [
    { id: 101, name: "Royal Heritage Necklace", price: "₹1,45,000", image: n2 },
    { id: 102, name: "Diamond Fleur-de-lis Ring", price: "₹85,000", image: r2 },
    { id: 103, name: "Classic Diamond Set", price: "₹2,10,000", image: dj2 },
    { id: 104, name: "Chandelier Diamond Earrings", price: "₹1,20,000", image: e2 }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section 
        className="hero" 
        onClick={() => navigate(heroSlides[currentSlide].link)}
        style={{ cursor: 'pointer' }}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="hero-bg"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: index === currentSlide ? -2 : -3
            }}
          ></div>
        ))}
        <div className="hero-overlay"></div>
        
        {/* Navigation Arrows */}
        <button 
          className="hero-arrow left-arrow" 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
          style={{ zIndex: 10 }}
        >
          <ChevronLeft size={40} />
        </button>
        <button 
          className="hero-arrow right-arrow" 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
          style={{ zIndex: 10 }}
        >
          <ChevronRight size={40} />
        </button>

        <div className="container hero-content" style={{ zIndex: 10, pointerEvents: 'none' }}>
          <div className="hero-text-wrapper">
            <h1>Experience The <span className="text-gold">Art Of Fine Jewelry</span></h1>
            <p>Discover a legacy of brilliance. Handcrafted diamond and gold collections designed to capture the essence of luxury and perfection.</p>
            <div className="hero-btns" style={{ pointerEvents: 'auto' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/shop'); }} 
                className="btn btn-primary"
              >
                Shop The Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges">
        <div className="container">
          <div className="badges-grid">
            <div className="badge-item">
              <ShieldCheck size={40} className="badge-icon" />
              <h4>BIS Hallmarked</h4>
              <p>100% pure 22KT gold</p>
            </div>
            <div className="badge-item">
              <Gem size={40} className="badge-icon" />
              <h4>Certified Diamonds</h4>
              <p>IGI & SGL certification</p>
            </div>
            <div className="badge-item">
              <Truck size={40} className="badge-icon" />
              <h4>Free Shipping</h4>
              <p>On orders above ₹999</p>
            </div>
            <div className="badge-item">
              <Clock size={40} className="badge-icon" />
              <h4>Lifetime Exchange</h4>
              <p>Buyback guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="section collections-section">
        <div className="container">
          <h2 className="section-title">Shop By Category</h2>
          <div className="collections-grid">
            {collections.map(item => (
              <Link to="/shop" key={item.id} className="collection-card">
                <div className="collection-img">
                  <img src={item.image} alt={item.title} />
                  <div className="img-overlay"></div>
                </div>
                <div className="collection-info">
                  <h3>{item.title}</h3>
                  <span className="explore-text">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="offers-section">
        <div className="container">
          <div className="offer-banner">
            <div className="offer-content">
              <h3>Festive Grandeur Sale</h3>
              <p>Flat 20% off on Diamond Making Charges</p>
              <h2><span className="small-text">UP TO</span> 50% OFF <span className="small-text">ON MAKING CHARGES</span></h2>
              <Link to="/shop" className="btn btn-primary">Claim Offer</Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section new-arrivals">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <div className="products-grid home-products-grid">
            {(products || []).slice(0, 12).map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-img-wrapper" style={{ position: 'relative' }}>
                  {(() => {
                    const dVal = parseInt(product.discount);
                    const activeDiscount = (!isNaN(dVal) && dVal > 0) ? dVal : 20;
                    return (
                      <div className="product-discount-badge" style={{
                        position: 'absolute', top: '12px', left: '12px', background: '#e74c3c', color: 'white', 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', zIndex: 5, letterSpacing: '0.5px'
                      }}>
                        {activeDiscount}% OFF
                      </div>
                    );
                  })()}
                  <img src={product.image} alt={product.name} />
                  <div className="product-actions">
                    <button 
                      className="action-btn" 
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product);
                          alert('Added to Wishlist!');
                        }
                      }}
                    >
                      <Gem size={18} fill={isInWishlist(product.id) ? "#C9A84C" : "none"} />
                    </button>
                  </div>
                </Link>
                <div className="product-details">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  <p className="product-purity">{product.metal} | {product.category}</p>
                  {(() => {
                    const rawPrice = parseInt((product.price || '₹0').replace(/[^\d]/g, ''));
                    const discountVal = parseInt(product.discount);
                    const activeDiscount = (!isNaN(discountVal) && discountVal > 0) ? discountVal : 20;
                    const originalPrice = Math.round(rawPrice * (1 + (activeDiscount / 100)));
                    
                    return (
                      <p className="product-price">
                        ₹{rawPrice.toLocaleString('en-IN')} 
                        <span style={{textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px'}}>₹{originalPrice.toLocaleString('en-IN')}</span>
                      </p>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-wrapper">
            <Link to="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
