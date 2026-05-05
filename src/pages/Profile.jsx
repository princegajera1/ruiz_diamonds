import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { ShoppingBag, User, Package, Clock, LogOut, TrendingUp, CreditCard } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!user) return <Navigate to="/login" />;

  const handleSave = () => {
    updateUser({ ...user, name: editedName });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const userOrders = (orders || []).filter(o => o.customerEmail?.toLowerCase() === user.email?.toLowerCase());

  const totalSpent = userOrders.reduce((sum, order) => {
    const amount = parseInt(order.total?.replace(/[^\d]/g, '') || '0', 10);
    return sum + amount;
  }, 0);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalSpent);

  return (
    <div className="profile-page container section">
      <div className="page-header text-center">
        <h1 className="section-title">My Dashboard</h1>
        <p className="subtitle">Managing your account and orders made simple.</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0) : '?'}
            </div>
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email}</p>
            <div className="user-since">Member since 2024</div>
          </div>
          
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} /> My Orders
            </button>
            <button 
              className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={20} /> Account Settings
            </button>
            <div className="nav-divider"></div>
            <button className="nav-item logout-btn" onClick={logout}><LogOut size={20} /> Logout</button>
          </nav>
        </aside>

        <main className="profile-content">
          {/* Quick Stats */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="stat-icon"><Package size={24} /></div>
              <div className="stat-info">
                <span>Total Orders</span>
                <h3>{userOrders.length}</h3>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="stat-icon"><CreditCard size={24} /></div>
              <div className="stat-info">
                <span>Total Spending</span>
                <h3>{formattedTotal}</h3>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="stat-icon"><TrendingUp size={24} /></div>
              <div className="stat-info">
                <span>Active Rewards</span>
                <h3>540 pts</h3>
              </div>
            </div>
          </div>

          {activeTab === 'personal' ? (
            <section className="profile-section fade-in">
              <div className="section-header">
                <h2><User size={22} /> Account Settings</h2>
                <p>Manage your personal details and security.</p>
              </div>
              <div className="personal-info-grid">
                <div className="info-box">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      className="edit-input" 
                      value={editedName} 
                      onChange={(e) => setEditedName(e.target.value)} 
                    />
                  ) : (
                    <p>{user.name}</p>
                  )}
                </div>
                <div className="info-box">
                  <label>Email Address</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-box">
                  <label>Phone Number</label>
                  <p>{user.phone || 'Not provided'}</p>
                </div>
                <div className="info-box">
                  <label>Default Currency</label>
                  <p>INR (₹)</p>
                </div>
              </div>
              
              <div className="actions-footer">
                {isEditing ? (
                  <div className="btn-group">
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                    <button className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Update Details
                  </button>
                )}
              </div>
            </section>
          ) : (
            <section className="profile-section fade-in">
              <div className="section-header">
                <h2><ShoppingBag size={22} /> Recent Orders</h2>
                <p>Track and manage your luxury purchases.</p>
              </div>
              
              {userOrders.length > 0 ? (
                <div className="orders-list">
                  {userOrders.map(order => (
                    <div key={order.id} className="order-item-card">
                      <div className="order-header">
                        <div className="order-meta">
                          <span className="order-id">#{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <div className={`status-pill ${order.status.toLowerCase()}`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="order-details-row">
                        <div className="items-summary">
                          <strong>Items:</strong>
                          <p>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <span key={idx}>{item.name} x {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
                              ))
                            ) : (
                              <span className="text-muted">No items found</span>
                            )}
                          </p>
                        </div>
                        <div className="order-amount">
                          <span>Total Amount</span>
                          <h3>{order.total}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-orders">
                  <Package size={48} />
                  <p>No orders found in your history.</p>
                  <button className="btn btn-primary mt-3" onClick={() => window.location.href='/shop'}>Browse Collection</button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
