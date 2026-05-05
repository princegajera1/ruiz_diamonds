import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu, X, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin } = useAuth();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Navbar Content */}      <div className="navbar container">
        <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} color="#C9A84C" /> : <Menu size={24} color="#C9A84C" />}
        </div>

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-text">GP GOLD</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/Gold" onClick={() => setIsMobileMenuOpen(false)}>Gold</Link>
          <Link to="/Diamonds" onClick={() => setIsMobileMenuOpen(false)}>Diamonds</Link>
          <Link to="/Rings" onClick={() => setIsMobileMenuOpen(false)}>Rings</Link>
          <Link to="/Earrings" onClick={() => setIsMobileMenuOpen(false)}>Earrings</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </nav>

        {/* Icons */}
        <div className="nav-icons">
          {user && (
            <>
              <Link to="/wishlist" className="icon-btn cart-icon-wrapper">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="icon-btn cart-icon-wrapper">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </>
          )}
          
          {user ? (
            <Link to="/profile" className="icon-btn user-profile-link">
              <div className="user-initial">{user?.name ? user.name.charAt(0) : '?'}</div>
            </Link>
          ) : (
            <Link to="/login" className="icon-btn">
              <User size={20} />
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="icon-btn admin-link" title="Admin Panel">
              <Settings size={20} />
              <span className="admin-text">Admin Panel</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
