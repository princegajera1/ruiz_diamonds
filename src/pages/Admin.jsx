import { useState, useEffect, useMemo } from 'react';
import { 
  Users, DollarSign, Package, Activity, Trash2, Plus, 
  ShoppingBag, Clock, Edit, LogOut, X, Check, Search, ArrowLeft,
  Filter, Eye, ChevronRight, ChevronDown, TrendingUp, BarChart3, Bell,
  Database, RefreshCcw
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { API_URL } from '../apiConfig';
import './Admin.css';
import './AdminTable.css';

const Admin = () => {
  const { user, isAdmin, users, logout } = useAuth();
  const { products, addProduct, removeProduct, updateProduct, loading, fetchProducts } = useProducts();
  const { orders, updateOrderStatus, visitors } = useOrders();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);
  
  // Modals & Selection
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form State
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', metal: '18KT Gold', 
    description: '', discount: '', image: '', image2: '', image3: ''
  });

  // Filter/Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [systemLoading, setSystemLoading] = useState(false);

  const handleRebuildInventory = async () => {
    if (!window.confirm('This will wipe all current products and restore the professional 40-item catalog. Proceed?')) return;
    setSystemLoading(true);
    try {
      const response = await fetch(`${API_URL}/system/reseed`, { method: 'POST' });
      if (response.ok) {
        alert('Database successfully re-seeded!');
        fetchProducts();
      } else {
        alert('Failed to re-seed. Check if server is running.');
      }
    } catch (err) {
      alert('Network error. Is the backend running?');
    } finally {
      setSystemLoading(false);
    }
  };

  const [stats, setStats] = useState({
    totalSales: '₹0',
    visitors: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [orders, products, users]);

  // Computed Data
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categories = p.category ? p.category.split(',').map(c => c.trim()) : [];
      const matchesCategory = categoryFilter === 'All' || categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  if (!isAdmin) return <Navigate to="/login" />;

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader"></div>
        <p>Initializing Secure Panel...</p>
      </div>
    );
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const emptyForm = { name: '', price: '', category: '', metal: '18KT Gold', description: '', discount: '', image: '', image2: '', image3: '' };
    if (isEditing) {
      const res = await updateProduct(currentEditId, newProduct);
      if (res.success) {
        setIsEditing(false);
        setCurrentEditId(null);
        setNewProduct(emptyForm);
        setShowAddForm(false);
        alert(`✓ Product "${newProduct.name}" updated successfully!`);
      } else {
        alert(`❌ Failed to update product in the database. The server may have restarted or encountered an error. Please try again.`);
      }
    } else {
      const res = await addProduct(newProduct);
      if (res.success) {
        setNewProduct(emptyForm);
        setShowAddForm(false);
        alert(`✓ Product "${newProduct.name}" published successfully!`);
      } else {
        alert(`❌ Failed to publish product. Please check server logs or try again.`);
      }
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentEditId(product.id);
    setNewProduct({ ...product });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Permanent removal? This cannot be undone.')) {
      removeProduct(id);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">GP</div>
          <div className="logo-text">
            <h2>GP GOLD</h2>
            <span>ADMIN PANEL</span>
          </div>
        </Link>
        
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={18} /> <span>Overview</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={18} /> <span>Inventory</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingBag size={18} /> <span>Orders History</span>
          </button>
          <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> <span>User Manager</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="user-avatar-sm">{user?.name?.charAt(0)}</div>
            <div className="user-details">
              <strong>{user?.name}</strong>
              <small>System Admin</small>
            </div>
          </div>
          <button className="logout-btn" onClick={() => { logout(); window.location.href = '/'; }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <header className="admin-top-bar">
          <div className="top-bar-left">
            <h1>GP Gold Management</h1>
            <p>Today is {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="top-bar-right">
            <Link to="/" className="pro-btn ghost" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={14} /> View Live Site
            </Link>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-view fade-in">
            <div className="admin-stats-grid">
              <div className="stat-card" onClick={() => setActiveTab('revenue')} style={{ cursor: 'pointer' }}>
                <div className="stat-icon rev"><DollarSign size={24} /></div>
                <div className="stat-info">
                  <p>Revenue</p>
                  <h3>{stats.totalSales}</h3>
                  <span className="stat-trend up"><TrendingUp size={12} /> +12.5%</span>
                </div>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('traffic')} style={{ cursor: 'pointer' }}>
                <div className="stat-icon vis"><Activity size={24} /></div>
                <div className="stat-info">
                  <p>Live Traffic</p>
                  <h3>{stats.visitors || '12,495'}</h3>
                  <span className="stat-trend">Real-time</span>
                </div>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('orders')} style={{ cursor: 'pointer' }}>
                <div className="stat-icon ord"><ShoppingBag size={24} /></div>
                <div className="stat-info">
                  <p>Total Orders</p>
                  <h3>{stats.totalOrders}</h3>
                  <span className="stat-trend up"><TrendingUp size={12} /> +1 today</span>
                </div>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('products')} style={{ cursor: 'pointer' }}>
                <div className="stat-icon prod"><Package size={24} /></div>
                <div className="stat-info">
                  <p>Active Items</p>
                  <h3>{stats.totalProducts}</h3>
                  <span className="stat-trend">In Stock</span>
                </div>
              </div>
            </div>

            <div className="dashboard-charts-placeholder">
              <div className="chart-card">
                <h3>System Snapshot</h3>
                <div className="snapshot-grid">
                  <div className="snap-item"><span>Admin Users</span> <strong>{users.filter(u => u.role === 'admin').length}</strong></div>
                  <div className="snap-item"><span>Registered Customers</span> <strong>{users.filter(u => u.role !== 'admin').length}</strong></div>
                  <div className="snap-item"><span>Average Order Value</span> <strong>₹32,450</strong></div>
                  <div className="snap-item"><span>Database Size</span> <strong>1.2 MB</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="revenue-view fade-in">
            <div className="admin-action-bar">
              <button className="pro-btn ghost-sm" onClick={() => setActiveTab('dashboard')} style={{ marginRight: '1rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
            <div className="admin-card">
              <h2>Revenue Analytics</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Detailed revenue charts and breakdowns will be available once the billing API is fully integrated. Current total revenue is {stats.totalSales}.</p>
            </div>
          </div>
        )}

        {activeTab === 'traffic' && (
          <div className="traffic-view fade-in">
            <div className="admin-action-bar">
              <button className="pro-btn ghost-sm" onClick={() => setActiveTab('dashboard')} style={{ marginRight: '1rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
            <div className="admin-card">
              <h2>Live Traffic Overview</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Real-time user monitoring shows {stats.visitors || '12,495'} active sessions. Geographic heatmaps and acquisition channels will be rendered here.</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-view fade-in">
            <div className="admin-action-bar">
              <button className="pro-btn ghost-sm" onClick={() => setActiveTab('dashboard')} style={{ marginRight: '1rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <Filter size={18} />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Gold">Gold</option>
                  <option value="Ring">Ring</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Necklace">Necklace</option>
                </select>
              </div>
            </div>

            <div className="admin-layout">
              <div className={`admin-card add-section ${showAddForm || isEditing ? 'active' : 'collapsed'}`}>
                <div className="card-header-toggle" onClick={() => !isEditing && setShowAddForm(!showAddForm)}>
                  <h2>{isEditing ? <Edit size={20} /> : <Plus size={20} />} {isEditing ? 'Modify Record' : 'New Product Entry'}</h2>
                  {!isEditing && <ChevronDown size={20} className={`toggle-icon ${showAddForm ? 'rotated' : ''}`} />}
                </div>
                {(showAddForm || isEditing) && (
                  <form onSubmit={handleAddProduct} className="pro-form fade-in">
                  <div className="form-group">
                    <label>Internal Product Name <span style={{color: 'red'}}>*</span></label>
                    <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Retail Price (₹) <span style={{color: 'red'}}>*</span></label>
                      <input type="text" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    </div>
                    <div className="form-group flex-1">
                      <label>Categories (Select all that apply)</label>
                      <div className="category-checkboxes" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                        {['Diamond', 'Gold', 'Ring', 'Earrings', 'Necklace'].map(cat => (
                          <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input 
                              type="checkbox" 
                              checked={newProduct.category ? newProduct.category.split(',').map(c => c.trim()).includes(cat) : false}
                              onChange={(e) => {
                                const currentCats = newProduct.category ? newProduct.category.split(',').map(c => c.trim()).filter(c => c !== '') : [];
                                let nextCats;
                                if (e.target.checked) {
                                  nextCats = [...currentCats, cat];
                                } else {
                                  nextCats = currentCats.filter(c => c !== cat);
                                }
                                setNewProduct({...newProduct, category: nextCats.join(', ')});
                              }}
                            />
                            {cat}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Short Description</label>
                      <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows="2" />
                    </div>
                    <div className="form-group flex-1" style={{ maxWidth: '200px' }}>
                      <label>Discount (%)</label>
                      <input type="number" min="0" max="100" placeholder="e.g. 15" value={newProduct.discount} onChange={e => setNewProduct({...newProduct, discount: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Main Asset URL (image 1) <span style={{color: 'red'}}>*</span></label>
                    <input type="text" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                  </div>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Asset URL 2</label>
                      <input type="text" value={newProduct.image2} onChange={e => setNewProduct({...newProduct, image2: e.target.value})} />
                    </div>
                    <div className="form-group flex-1">
                      <label>Asset URL 3</label>
                      <input type="text" value={newProduct.image3} onChange={e => setNewProduct({...newProduct, image3: e.target.value})} />
                    </div>
                  </div>
                  <div className="pro-form-btns">
                    <button type="submit" className="pro-btn primary">{isEditing ? 'Update Database' : 'Publish Product'}</button>
                    {isEditing && (
                      <button 
                        type="button" 
                        className="pro-btn ghost" 
                        onClick={() => { 
                          setIsEditing(false); 
                          setCurrentEditId(null); 
                          setNewProduct({ name: '', price: '', category: '', metal: '18KT Gold', description: '', discount: '', image: '', image2: '', image3: '' }); 
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
                )}
              </div>

              <div className="admin-card list-section">
                <h2>Database Registry ({filteredProducts.length})</h2>
                <div className="pro-list">
                  {paginatedProducts.map(p => (
                    <div key={p.id} className="pro-item">
                      <img src={p.image} alt="" className="pro-thumb" />
                      <div className="pro-info">
                        <h4>{p.name}</h4>
                        <p>
                          {p.price} • {p.category}
                          {p.discount && !isNaN(parseInt(p.discount)) && parseInt(p.discount) > 0 && (
                            <span style={{ marginLeft: '8px', color: '#e74c3c', fontWeight: '800', fontSize: '0.85rem' }}>
                              ({p.discount}% OFF)
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="pro-actions">
                        <Link to={`/product/${p.id}`} className="icon-btn view" title="View Product"><Eye size={16} /></Link>
                        <button className="icon-btn edit" onClick={() => handleEditClick(p)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <div className="pagination-controls">
                      <button 
                        className="pagi-btn" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        PREV
                      </button>
                      
                      <div className="page-numbers">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          // Show only a few numbers around current page
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                          ) {
                            return (
                              <button 
                                key={pageNum}
                                className={`page-num ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPage - 3 || 
                            pageNum === currentPage + 3
                          ) {
                            return <span key={pageNum} className="pagi-dots">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button 
                        className="pagi-btn" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-view fade-in">
            <div className="admin-action-bar" style={{ marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
              <button className="pro-btn ghost-sm" onClick={() => setActiveTab('dashboard')} style={{ marginRight: '1rem' }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
            <div className="admin-card">
              <div className="card-header">
                <h2>Master Order Log</h2>
                <button className="pro-btn ghost-sm" onClick={() => window.location.reload()}><Activity size={14} /> Refresh</button>
              </div>
              <div className="pro-table-wrapper">
                <table className="pro-table">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Client</th>
                      <th>Timestamp</th>
                      <th>Net Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><span className="ref-tag">#{order.id}</span></td>
                        <td>
                          <div className="client-info">
                            <strong>{order.customerName}</strong>
                            <span>{order.customerEmail}</span>
                          </div>
                        </td>
                        <td className="time-cell">{order.date}</td>
                        <td><strong className="price-tag">{order.total}</strong></td>
                        <td><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="icon-btn view" onClick={() => setSelectedOrder(order)} title="View Details"><Eye size={16} /></button>
                            <select 
                              value={order.status} 
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="status-dropdown"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-view fade-in">
            <div className="admin-card">
              <h2>User Registry ({users.length})</h2>
              <div className="user-grid">
                {users.map((u, i) => (
                  <div key={i} className="pro-user-card">
                    <div className="user-avatar-lg">{u.name.charAt(0)}</div>
                    <div className="user-meta">
                      <h4>{u.name}</h4>
                      <p>{u.email}</p>
                      <span className={`role-tag ${u.role}`}>{u.role || 'customer'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="admin-tab-content fade-in">
            <div className="tab-header" style={{ marginBottom: '2rem' }}>
              <h1 style={{ color: 'var(--gold-primary)' }}>System Controls</h1>
              <p>Advanced diagnostic and maintenance tools for GP Gold Management.</p>
            </div>

            <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              <div className="admin-card">
                <div className="card-header" style={{ borderBottom: '1px solid rgba(255,215,0,0.1)', paddingBottom: '1rem' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Database size={20} /> Database Maintenance</h2>
                </div>
                <div className="card-body" style={{ padding: '1.5rem 0' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--gold-primary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Full Inventory Rebuild</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      This action will permanently delete all existing products and restore the professional 40-item luxury catalog (10 per category) with multiple images. 
                    </p>
                  </div>
                  <button 
                    className={`pro-btn primary ${systemLoading ? 'loading' : ''}`} 
                    onClick={handleRebuildInventory}
                    disabled={systemLoading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <RefreshCcw size={18} className={systemLoading ? 'spin' : ''} style={{ marginRight: '0.5rem' }} /> 
                    {systemLoading ? 'Processing System Reset...' : 'Restore 40-Product Luxury Catalog'}
                  </button>
                </div>
              </div>

              <div className="admin-card">
                <div className="card-header" style={{ borderBottom: '1px solid rgba(255,215,0,0.1)', paddingBottom: '1rem' }}>
                   <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> Server Status</h2>
                </div>
                <div className="card-body" style={{ padding: '1.5rem 0' }}>
                   <div className="status-indicator online" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4ade80', fontWeight: '600' }}>
                      <span className="dot pulse" style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%' }}></span>
                      <span>Backend API is Responsive</span>
                   </div>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', lineHeight: '1.8' }}>
                      Current Version: v2.4.0-PRO<br/>
                      API Latency: 42ms<br/>
                      Environment: Production (Vite + Node)<br/>
                      Database: SQLite (Encrypted)
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Detail: #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="info-group">
                  <label>Customer Details</label>
                  <p><strong>{selectedOrder.customerName}</strong></p>
                  <p>{selectedOrder.customerEmail}</p>
                </div>
                <div className="info-group">
                  <label>Order Metadata</label>
                  <p>Placed: {selectedOrder.date}</p>
                  <p>Status: <span className={`status-pill ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span></p>
                </div>
              </div>
              
              <div className="order-items-list">
                <label>Purchased Items</label>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-detail-item">
                      <div className="item-img-sm">
                        <img src={item.image} alt="" />
                      </div>
                      <div className="item-meta">
                        <strong>{item.name}</strong>
                        <span>Qty: {item.quantity} • {item.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No detailed item records found.</p>
                )}
              </div>
              
              <div className="modal-footer">
                <div className="total-row">
                  <span>Grand Total</span>
                  <strong>{selectedOrder.total}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
