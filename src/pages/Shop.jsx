import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Gem, ShoppingCart } from 'lucide-react';
import dj1 from '../assets/Diamond Jewelry1.jpg';
import dj2 from '../assets/Diamond Jewelry2.jpg';
import dj3 from '../assets/Diamond Jewelry3.jpg';
import dj4 from '../assets/Diamond Jewelry4.jpg';
import dj5 from '../assets/Diamond Jewelry5.jpg';
import e1 from '../assets/Earrings1.jpg';
import e2 from '../assets/Earrings2.jpg';
import e3 from '../assets/Earrings3.jpg';
import e4 from '../assets/Earrings4.jpg';
import e5 from '../assets/Earrings5.jpg';
import gn1 from '../assets/Gold Necklaces1.jpg';
import gn2 from '../assets/Gold Necklaces2.jpg';
import gn3 from '../assets/Gold Necklaces3.jpg';
import gn4 from '../assets/Gold Necklaces4.jpg';
import gn5 from '../assets/Gold Necklaces5.jpg';
import gr1 from '../assets/Gold Rings1.jpg';
import gr2 from '../assets/Gold Rings2.jpg';
import gr3 from '../assets/Gold Rings3.jpg';
import gr4 from '../assets/Gold Rings4.jpg';
import gr5 from '../assets/Gold Rings5.jpg';
import r1 from '../assets/Rings1.jpg';
import r2 from '../assets/Rings2.jpg';
import r3 from '../assets/Rings3.jpg';
import r4 from '../assets/Rings4.jpg';
import r5 from '../assets/Rings5.jpg';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import './Shop.css';

const Shop = ({ defaultCategory }) => {
  const [searchParams] = useSearchParams();
  const categoryFilter = defaultCategory || searchParams.get('category');
  
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [sortOption, setSortOption] = useState('Recommended');

  const { addToCart } = useCart();
  const { products } = useProducts();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      alert(`${product.name} added to Wishlist!`);
    }
  };

  const getProductOccasions = (product) => {
    const name = product.name.toLowerCase();
    const occasions = [];
    if (name.includes('bridal') || name.includes('wedding')) occasions.push('Bridal');
    if (name.includes('engagement') || name.includes('solitaire') || name.includes('halo')) occasions.push('Engagement');
    if (name.includes('daily') || name.includes('simple') || name.includes('stud') || name.includes('band')) occasions.push('Daily Wear');
    if (name.includes('chandelier') || name.includes('party') || name.includes('drop') || name.includes('necklace')) occasions.push('Party');
    if (occasions.length === 0) occasions.push('Party', 'Daily Wear');
    return occasions;
  };

  const getProductGenders = (product) => {
    const name = product.name.toLowerCase();
    const genders = [];
    if (name.includes('men') || name.includes('couple')) genders.push('Men');
    if (name.includes('women') || name.includes('bridal') || name.includes('couple')) genders.push('Women');
    if (name.includes('kids')) genders.push('Kids');
    if (genders.length === 0) genders.push('Women');
    return genders;
  };

  const filteredProducts = (products || []).filter(product => {
    let matchCategory = true;
    if (categoryFilter) {
      const productCategories = product.category ? product.category.split(',').map(c => c.trim()) : [];
      if (categoryFilter === 'Gold') {
        matchCategory = productCategories.includes('Gold') || (product.category !== 'Diamond' && product.metal && product.metal.includes('22KT'));
      } else {
        matchCategory = productCategories.includes(categoryFilter);
      }
    }

    let matchMetal = true;
    if (selectedMetals.length > 0) {
      matchMetal = selectedMetals.some(metal => product.metal.includes(metal));
    }

    let matchPrice = true;
    if (selectedPrices.length > 0) {
      const priceNum = parseInt(product.price.replace(/[^\d]/g, ''), 10);
      matchPrice = selectedPrices.some(range => {
        if (range === 'under50k') return priceNum < 50000;
        if (range === '50k-1L') return priceNum >= 50000 && priceNum <= 100000;
        if (range === '1L-2L') return priceNum > 100000 && priceNum <= 200000;
        if (range === 'above2L') return priceNum > 200000;
        return false;
      });
    }

    let matchOccasion = true;
    if (selectedOccasions.length > 0) {
      const productOccasions = getProductOccasions(product);
      matchOccasion = selectedOccasions.some(occ => productOccasions.includes(occ));
    }

    let matchGender = true;
    if (selectedGenders.length > 0) {
      const productGenders = getProductGenders(product);
      matchGender = selectedGenders.some(gen => productGenders.includes(gen));
    }

    return matchCategory && matchMetal && matchPrice && matchOccasion && matchGender;
  });

  let sortedProducts = [...filteredProducts];
  if (sortOption === 'Price: Low to High') {
    sortedProducts.sort((a, b) => {
      const getPrice = (p) => {
        const rawPrice = parseInt((p.price || '₹0').replace(/[^\d]/g, ''));
        const dVal = parseInt(p.discount);
        const activeDiscount = (!isNaN(dVal) && dVal > 0) ? dVal : 20;
        return Math.round(rawPrice - (rawPrice * (activeDiscount / 100)));
      };
      return getPrice(a) - getPrice(b);
    });
  } else if (sortOption === 'Price: High to Low') {
    sortedProducts.sort((a, b) => {
      const getPrice = (p) => {
        const rawPrice = parseInt((p.price || '₹0').replace(/[^\d]/g, ''));
        const dVal = parseInt(p.discount);
        const activeDiscount = (!isNaN(dVal) && dVal > 0) ? dVal : 20;
        return Math.round(rawPrice - (rawPrice * (activeDiscount / 100)));
      };
      return getPrice(b) - getPrice(a);
    });
  } else if (sortOption === 'New Arrivals') {
    sortedProducts.reverse();
  }

  const handleCheckboxChange = (setState) => (value) => {
    setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const clearAllFilters = () => {
    setSelectedMetals([]);
    setSelectedPrices([]);
    setSelectedOccasions([]);
    setSelectedGenders([]);
  };

  return (
    <div className="shop-page container section">
      <div className="page-header text-center">
        <h1 className="section-title">Our Collections</h1>
        <p className="subtitle">Discover our exclusive range of fine jewellery</p>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-filters">
          <div className="filter-header">
            <h3><Filter size={18} /> Filters</h3>
            {(selectedMetals.length > 0 || selectedPrices.length > 0 || selectedOccasions.length > 0 || selectedGenders.length > 0) && (
              <button className="clear-btn" onClick={clearAllFilters}>Reset</button>
            )}
          </div>

          <div className="filter-group">
            <h4>Metal Type <ChevronDown size={16} /></h4>
            <div className="filter-options">
              <label><input type="checkbox" checked={selectedMetals.includes('22KT')} onChange={() => handleCheckboxChange(setSelectedMetals)('22KT')} /> 22KT Yellow Gold</label>
              <label><input type="checkbox" checked={selectedMetals.includes('18KT')} onChange={() => handleCheckboxChange(setSelectedMetals)('18KT')} /> 18KT Yellow Gold</label>
              <label><input type="checkbox" checked={selectedMetals.includes('Rose Gold')} onChange={() => handleCheckboxChange(setSelectedMetals)('Rose Gold')} /> 18KT Rose Gold</label>
              <label><input type="checkbox" checked={selectedMetals.includes('Platinum')} onChange={() => handleCheckboxChange(setSelectedMetals)('Platinum')} /> Platinum</label>
            </div>
          </div>

          <div className="filter-group">
            <h4>Price Range <ChevronDown size={16} /></h4>
            <div className="filter-options">
              <label><input type="checkbox" checked={selectedPrices.includes('under50k')} onChange={() => handleCheckboxChange(setSelectedPrices)('under50k')} /> Under ₹50,000</label>
              <label><input type="checkbox" checked={selectedPrices.includes('50k-1L')} onChange={() => handleCheckboxChange(setSelectedPrices)('50k-1L')} /> ₹50,000 - ₹1,00,000</label>
              <label><input type="checkbox" checked={selectedPrices.includes('1L-2L')} onChange={() => handleCheckboxChange(setSelectedPrices)('1L-2L')} /> ₹1,00,000 - ₹2,00,000</label>
              <label><input type="checkbox" checked={selectedPrices.includes('above2L')} onChange={() => handleCheckboxChange(setSelectedPrices)('above2L')} /> Above ₹2,00,000</label>
            </div>
          </div>

          <div className="filter-group">
            <h4>Occasion <ChevronDown size={16} /></h4>
            <div className="filter-options">
              <label><input type="checkbox" checked={selectedOccasions.includes('Bridal')} onChange={() => handleCheckboxChange(setSelectedOccasions)('Bridal')} /> Bridal</label>
              <label><input type="checkbox" checked={selectedOccasions.includes('Engagement')} onChange={() => handleCheckboxChange(setSelectedOccasions)('Engagement')} /> Engagement</label>
              <label><input type="checkbox" checked={selectedOccasions.includes('Daily Wear')} onChange={() => handleCheckboxChange(setSelectedOccasions)('Daily Wear')} /> Daily Wear</label>
              <label><input type="checkbox" checked={selectedOccasions.includes('Party')} onChange={() => handleCheckboxChange(setSelectedOccasions)('Party')} /> Party</label>
            </div>
          </div>

          <div className="filter-group">
            <h4>Gender <ChevronDown size={16} /></h4>
            <div className="filter-options">
              <label><input type="checkbox" checked={selectedGenders.includes('Women')} onChange={() => handleCheckboxChange(setSelectedGenders)('Women')} /> Women</label>
              <label><input type="checkbox" checked={selectedGenders.includes('Men')} onChange={() => handleCheckboxChange(setSelectedGenders)('Men')} /> Men</label>
              <label><input type="checkbox" checked={selectedGenders.includes('Kids')} onChange={() => handleCheckboxChange(setSelectedGenders)('Kids')} /> Kids</label>
            </div>
          </div>

        </aside>

        {/* Product Grid */}
        <main className="shop-main">
          <div className="shop-controls">
            <p>Showing {filteredProducts.length} products</p>
            <div className="sort-by">
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="Recommended">Recommended</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="New Arrivals">New Arrivals</option>
              </select>
            </div>
          </div>

          <div className="products-grid shop-products-grid">
            {sortedProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrapper" style={{ position: 'relative' }}>
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
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="product-actions">
                    <button 
                      className="action-btn" 
                      title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"} 
                      onClick={(e) => handleWishlist(e, product)}
                    >
                      <Gem size={18} fill={isInWishlist(product.id) ? "#C9A84C" : "none"} />
                    </button>
                    <button className="action-btn" title="Add to Cart" onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                      alert('Added to Cart!');
                    }}><ShoppingCart size={18} /></button>
                  </div>
                </div>
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
        </main>
      </div>
    </div>
  );
};

export default Shop;
