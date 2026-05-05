import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, HeartCrack } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlist-page container section">
      <h1 className="section-title text-center">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist text-center">
          <HeartCrack size={64} className="empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite items here to easily find them later.</p>
          <Link to="/shop" className="btn btn-primary mt-4" style={{ display: 'inline-block' }}>Explore Collections</Link>
        </div>
      ) : (
        <div className="wishlist-grid products-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-img-wrapper">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                </Link>
                <div className="product-actions">
                  <button 
                    className="action-btn remove-btn" 
                    title="Remove from Wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    className="action-btn cart-btn" 
                    title="Add to Cart"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(item);
                      alert('Added to Cart!');
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
              <div className="product-details">
                <Link to={`/product/${item.id}`}>
                  <h3 className="product-name">{item.name}</h3>
                </Link>
                <p className="product-purity">{item.metal} | {item.category}</p>
                <p className="product-price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
