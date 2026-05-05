import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import './Cart.css';
import './PaymentModal.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const makingCharges = cart.length > 0 ? 25000 : 0;
  const discount = cart.length > 0 ? 5000 : 0;
  const total = subtotal + makingCharges - discount;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async (method) => {
    setIsProcessing(true);
    try {
      const order = await placeOrder({
        customerName: user.name,
        customerEmail: user.email,
        items: cart,
        total: formatPrice(total),
        paymentMethod: method
      });
      
      setIsProcessing(false);
      setShowPaymentModal(false);
      clearCart();
      
      if (order) {
        alert(`Payment of ${formatPrice(total)} via ${method} successful! Your order #${order.id} has been placed.`);
        navigate('/profile');
      }
    } catch (error) {
      setIsProcessing(false);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="cart-page container section">
      <h1 className="section-title">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart-message text-center">
          <h2>Your cart is currently empty.</h2>
          <p>Discover our exclusive collections to find something beautiful.</p>
          <Link to="/shop" className="btn btn-primary mt-4" style={{ display: 'inline-block' }}>Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-container">
            <div className="cart-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.metal} | {item.category}</p>
                  </div>
                </div>
                <div className="item-quantity">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
                <div className="item-price">
                  <span>{item.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Making Charges</span>
              <span>{formatPrice(makingCharges)}</span>
            </div>
            <div className="summary-row">
              <span>Discount (20% on Making)</span>
              <span className="discount">-{formatPrice(discount)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="taxes-note">Inclusive of 3% GST</p>

            <button className="btn btn-primary w-100 checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="secure-checkout">
              <div className="secure-item"><Lock size={16} /> Secure Checkout</div>
              <div className="secure-item"><ShieldCheck size={16} /> 100% Authentic</div>
              <div className="secure-item"><CreditCard size={16} /> EMI Available</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Complete Payment</h3>
              <button className="close-modal" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <div className="payment-modal-body">
              <p className="payment-amount">Total Amount: <strong>{formatPrice(total)}</strong></p>
              
              {isProcessing ? (
                <div className="processing-payment">
                  <div className="spinner"></div>
                  <p>Processing your payment...</p>
                </div>
              ) : (
                <div className="payment-options">
                  <div className="payment-method razorpay" onClick={() => handlePayment('Razorpay')}>
                    <CreditCard size={24} />
                    <span>Pay with Razorpay</span>
                  </div>
                  <div className="payment-method stripe" onClick={() => handlePayment('Stripe')}>
                    <CreditCard size={24} />
                    <span>Pay with Stripe</span>
                  </div>
                  <div className="payment-method upi" onClick={() => handlePayment('UPI')}>
                    <ShieldCheck size={24} />
                    <span>Pay via UPI / Netbanking</span>
                  </div>
                </div>
              )}
            </div>
            <div className="payment-modal-footer">
              <p><Lock size={12} /> SSL Secured Payment Gateway</p>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
