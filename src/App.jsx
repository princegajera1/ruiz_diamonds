import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Policy from './pages/Policy';
import Terms from './pages/Terms';
import Shipping from './pages/Shipping';
import Wishlist from './pages/Wishlist';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? "admin-content-fullscreen" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          
          {/* Shorter Category Routes */}
          <Route path="/Gold" element={<Shop defaultCategory="Gold" />} />
          <Route path="/Diamonds" element={<Shop defaultCategory="Diamond" />} />
          <Route path="/Rings" element={<Shop defaultCategory="Ring" />} />
          <Route path="/Earrings" element={<Shop defaultCategory="Earrings" />} />
          
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      
      {/* Floating WhatsApp Button */}
      {!isAdminPath && (
        <a href="https://wa.me/919727031027" target="_blank" rel="noreferrer" className="floating-whatsapp">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
        </a>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <ScrollToTop />
                <AppContent />
              </Router>
            </CartProvider>
          </WishlistProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
