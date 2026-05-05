import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, Star, Heart, Gem, ShoppingCart, RefreshCw, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

// Helper: resolve image URL — works for both /src/assets/ (Vite) and external URLs
const resolveImage = (src) => {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  // /src/assets/ paths served via Vite dev server — strip leading /src
  if (src.startsWith('/src/assets/')) return src;
  return src;
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getProductById, products } = useProducts();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const contextProduct = getProductById(id);

  const product = contextProduct || {
    id,
    name: "Royal Heritage Diamond Ring",
    price: "₹85,000",
    image: null,
    category: "Ring",
    metal: "18KT Gold",
    description: "An exquisite piece crafted with care.",
  };

  // Build ordered image list: product's own images
  const buildImages = () => {
    const imgs = [];
    if (product.image) imgs.push(product.image);
    if (product.image2) imgs.push(product.image2);
    if (product.image3) imgs.push(product.image3);
    return { ownImages: imgs };
  };

  const { ownImages } = buildImages();
  const allThumbs = [
    ...ownImages.map(img => ({ img, pid: null })),
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (product && product.image) {
      setSelectedImage(product.image);
    }
  }, [product?.id, product?.image]);

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      alert('Added to Wishlist!');
    }
  };

  const specs = [
    { label: 'Gold Purity', value: product.metal || '18KT Gold' },
    { label: 'Gross Weight', value: '8.50 g' },
    { label: 'Diamond Weight', value: '0.75 ct' },
    { label: 'Diamond Quality', value: 'VVS-VS / E-F' },
    { label: 'Category', value: product.category },
    { label: 'Certificate', value: 'IGI Certified' },
  ];

  const primaryCategory = product.category ? product.category.split(',')[0].trim() : 'Diamond';
  const categoryLink = primaryCategory === 'Diamond' ? 'Diamonds' : primaryCategory + 's';

  const recommendations = (products || [])
    .filter(p => {
      const pCats = p.category ? p.category.split(',').map(c => c.trim()) : [];
      return pCats.some(cat => product.category.includes(cat)) && String(p.id) !== String(id);
    })
    .slice(0, 4);

  return (
    <div className="pdp-page">
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/${categoryLink}`}>{primaryCategory}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="pdp-layout">
        {/* ─── LEFT: Gallery ─── */}
        <div className="pdp-gallery">

          {/* MAIN BIG IMAGE */}
          <div className={`pdp-main-img ${zoom ? 'zoomed' : ''}`} onClick={() => setZoom(!zoom)}>
            {(() => {
              const dVal = parseInt(product.discount);
              const activeDiscount = (!isNaN(dVal) && dVal > 0) ? dVal : 20;
              return (
                <div className="product-discount-badge" style={{
                  position: 'absolute', top: '15px', left: '15px', background: '#e74c3c', color: 'white', 
                  padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '800', zIndex: 5, letterSpacing: '0.5px'
                }}>
                  {activeDiscount}% OFF
                </div>
              );
            })()}
            {selectedImage ? (
              <img src={resolveImage(selectedImage)} alt={product.name} />
            ) : (
              <div className="pdp-img-placeholder">
                <Gem size={64} />
                <p>Image not available</p>
              </div>
            )}
            <div className="pdp-zoom-hint">🔍 Click to {zoom ? 'shrink' : 'zoom'}</div>
          </div>

          {/* THUMBNAIL STRIP — BELOW MAIN IMAGE */}
          {allThumbs.length > 0 && (
            <div className="pdp-thumbs">
              {allThumbs.map((item, i) => {
                const isActive = selectedImage === item.img;
                if (item.pid) {
                  // Similar product — clicking navigates
                  return (
                    <Link
                      key={i}
                      to={`/product/${item.pid}`}
                      className={`pdp-thumb ${isActive ? 'active' : ''}`}
                      title={item.name}
                    >
                      <img src={resolveImage(item.img)} alt={item.name || `View ${i + 1}`} />
                      <div className="pdp-thumb-overlay">→</div>
                    </Link>
                  );
                }
                return (
                  <div
                    key={i}
                    className={`pdp-thumb ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedImage(item.img)}
                  >
                    <img src={resolveImage(item.img)} alt={`View ${i + 1}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── RIGHT: Product Info ─── */}
        <div className="pdp-info">
          <div className="pdp-category-tag">{primaryCategory} Collection</div>
          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#C9A84C" color="#C9A84C" />
            ))}
            <span>(24 Reviews)</span>
          </div>

          {(() => {
            const rawPrice = parseInt((product.price || '₹0').replace(/[^\d]/g, ''));
            const discountVal = parseInt(product.discount);
            const activeDiscount = (!isNaN(discountVal) && discountVal > 0) ? discountVal : 20;
            
            const originalPrice = Math.round(rawPrice * (1 + (activeDiscount / 100)));
            
            return (
              <div className="pdp-price-row">
                <span className="pdp-price">₹{rawPrice.toLocaleString('en-IN')}</span>
                <span className="pdp-old-price">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="pdp-discount">{activeDiscount}% OFF</span>
              </div>
            );
          })()}
          <p className="pdp-tax-note">Inclusive of all taxes</p>

          <p className="pdp-desc">{product.description || 'An exquisite piece crafted with the finest materials for unmatched luxury and elegance.'}</p>

          {/* Specs Table */}
          <div className="pdp-specs">
            {specs.map((s, i) => (
              <div key={i} className="pdp-spec-row">
                <span className="pdp-spec-label">{s.label}</span>
                <span className="pdp-spec-value">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pdp-actions">
            <button className="pdp-btn pdp-btn-cart" onClick={() => { addToCart(product); alert('Added to Cart!'); }}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <Link to="/cart" className="pdp-btn pdp-btn-buy" onClick={() => addToCart(product)}>
              Buy Now
            </Link>
            <a href="https://wa.me/919727031027" target="_blank" rel="noreferrer" className="pdp-btn pdp-btn-whatsapp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{width: 20, height: 20}} />
              WhatsApp
            </a>
            <button className={`pdp-btn pdp-btn-wish ${isInWishlist(product.id) ? 'wished' : ''}`} onClick={handleWishlist}>
              <Heart size={22} fill={isInWishlist(product.id) ? "#C9A84C" : "none"} />
            </button>
          </div>

          {/* EMI */}
          <div className="pdp-emi">
            <strong>No Cost EMI</strong> starts from ₹4,100/month · <a href="#">View Plans</a>
          </div>

          {/* Trust Badges */}
          <div className="pdp-trust">
            <div className="pdp-badge">
              <ShieldCheck size={22} />
              <span>BIS Hallmarked</span>
            </div>
            <div className="pdp-badge">
              <Award size={22} />
              <span>IGI Certified</span>
            </div>
            <div className="pdp-badge">
              <Truck size={22} />
              <span>Free Shipping</span>
            </div>
            <div className="pdp-badge">
              <RefreshCw size={22} />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {recommendations.length > 0 && (
        <section className="pdp-recs">
          <div className="pdp-recs-header">
            <h2>You May Also Like</h2>
            <div className="pdp-recs-divider" />
          </div>
          <div className="pdp-recs-grid">
            {recommendations.map(p => (
              <div key={p.id} className="pdp-rec-card">
                <Link to={`/product/${p.id}`} className="pdp-rec-img">
                  {p.image ? (
                    <img src={resolveImage(p.image)} alt={p.name} />
                  ) : (
                    <div className="pdp-img-placeholder sm"><Gem size={32} /></div>
                  )}
                  <div className="pdp-rec-overlay">View Details</div>
                </Link>
                <div className="pdp-rec-info">
                  <Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link>
                  <p>{p.metal} · {p.category}</p>
                  <span>{p.price}</span>
                  <button onClick={() => { addToCart(p); alert('Added to Cart!'); }}>
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
