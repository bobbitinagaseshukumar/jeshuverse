import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, LayoutDashboard, ShoppingBag, Users, Layers, AlertCircle, Check } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modals States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodSizes, setProdSizes] = useState(['S', 'M', 'L']);
  const [prodImages, setProdImages] = useState(['']);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Fetch all dashboard requirements
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes, catRes, userRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/categories'),
        api.get('/auth/users'),
      ]);
      setProducts(prodRes.data.products);
      setOrders(orderRes.data);
      setCategories(catRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Modal resets
  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?._id || '');
    setProdPrice('');
    setProdStock('');
    setProdDescription('');
    setProdSizes(['S', 'M', 'L']);
    setProdImages(['']);
    setFormError('');
    setFormSuccess(false);
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category?._id || product.category || '');
    setProdPrice(product.price);
    setProdStock(product.stock);
    setProdDescription(product.description);
    setProdSizes(product.sizes || []);
    setProdImages(product.images || ['']);
    setFormError('');
    setFormSuccess(false);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    // Filter empty image strings
    const filteredImages = prodImages.filter((img) => img.trim() !== '');
    if (filteredImages.length === 0) {
      setFormError('At least one product image URL is required.');
      return;
    }

    const payload = {
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      stock: Number(prodStock),
      description: prodDescription,
      sizes: prodSizes,
      images: filteredImages,
    };

    try {
      if (editingProduct) {
        // Edit mode
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        // Add mode
        await api.post('/products', payload);
      }
      setFormSuccess(true);
      setTimeout(() => {
        setShowProductModal(false);
        fetchDashboardData();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Image helpers
  const addImageField = () => setProdImages([...prodImages, '']);
  const updateImageField = (idx, val) => {
    const updated = [...prodImages];
    updated[idx] = val;
    setProdImages(updated);
  };
  const removeImageField = (idx) => {
    if (prodImages.length > 1) {
      setProdImages(prodImages.filter((_, i) => i !== idx));
    }
  };

  // Size checks
  const handleSizeToggle = (size) => {
    setProdSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Metric computations
  const totalSales = orders
    .filter((o) => o.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  if (loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-64 bg-gray-50 border border-gray-100 rounded mb-8"></div>
        <div className="h-96 bg-gray-50 border border-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">Admin Panel</span>
          <h1 className="text-2xl font-bold uppercase text-black mt-1 font-serif">Store Dashboard</h1>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-gray-100 p-1 border border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-150 ${
              activeTab === 'overview' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            <LayoutDashboard size={13} className="mr-1.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-150 ${
              activeTab === 'products' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            <Layers size={13} className="mr-1.5" /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all duration-150 ${
              activeTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            <ShoppingBag size={13} className="mr-1.5" /> Orders
          </button>
        </div>
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Sales</span>
              <span className="text-2xl font-bold text-black mt-2">₹{totalSales.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-green-600 mt-2 font-semibold">Payment captured</span>
            </div>

            <div className="bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Orders</span>
              <span className="text-2xl font-bold text-black mt-2">{orders.length}</span>
              <span className="text-[10px] text-gray-500 mt-2 font-semibold">Placed checkups</span>
            </div>

            <div className="bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Products</span>
              <span className="text-2xl font-bold text-black mt-2">{products.length}</span>
              <span className="text-[10px] text-red-500 mt-2 font-semibold flex items-center">
                {outOfStockCount > 0 ? (
                  <>
                    <AlertCircle size={12} className="mr-1" />
                    {outOfStockCount} Out of Stock
                  </>
                ) : (
                  'All items in stock'
                )}
              </span>
            </div>

            <div className="bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Registered Clients</span>
              <span className="text-2xl font-bold text-black mt-2">{users.length}</span>
              <span className="text-[10px] text-gray-500 mt-2 font-semibold">Registered users count</span>
            </div>
          </div>

          {/* Quick List Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Latest Orders */}
            <div className="border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-4 pb-2 border-b border-gray-100">
                Recent Orders
              </h3>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex justify-between items-center text-xs pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div>
                      <span className="font-semibold text-black block">{order.user?.name || 'Guest User'}</span>
                      <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-black block">₹{order.totalPrice}</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gold">{order.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-4 pb-2 border-b border-gray-100">
                Stock Notifications
              </h3>
              <div className="space-y-4">
                {products.filter((p) => p.stock <= 5).slice(0, 5).map((prod) => (
                  <div key={prod._id} className="flex justify-between items-center text-xs pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div>
                      <span className="font-semibold text-black block">{prod.name}</span>
                      <span className="text-[10px] text-gray-400">{prod.category?.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${
                      prod.stock === 0 ? 'text-red-600' : 'text-orange-500'
                    }`}>
                      {prod.stock === 0 ? 'Sold Out' : `${prod.stock} left`}
                    </span>
                  </div>
                ))}
                {products.filter((p) => p.stock <= 5).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">All products have healthy stock levels.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400">Inventory Catalog</h2>
            <button
              onClick={openAddModal}
              className="btn-gold py-2.5 px-5 text-xs font-bold tracking-widest flex items-center shadow-md"
            >
              <Plus size={14} className="mr-1.5" /> Add Product
            </button>
          </div>

          {/* Catalog Table */}
          <div className="border border-gray-100 shadow-sm overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 uppercase tracking-widest font-bold text-gray-400 text-[10px]">
                  <th className="p-4">Product details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price (₹)</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 aspect-[3/4] bg-gray-50 overflow-hidden shrink-0 border border-gray-200">
                        <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-black block truncate max-w-[200px]" title={prod.name}>
                        {prod.name}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-500">{prod.category?.name || 'General'}</td>
                    <td className="p-4 font-bold text-black text-right">₹{prod.price.toLocaleString('en-IN')}</td>
                    <td className={`p-4 text-center font-bold ${
                      prod.stock === 0 ? 'text-red-500' : 'text-gray-700'
                    }`}>{prod.stock}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 border border-gray-200 text-gray-400 hover:text-black transition-colors"
                          aria-label="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleProductDelete(prod._id)}
                          className="p-2 border border-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400">Dispatch Order Tracking</h2>

          <div className="border border-gray-100 shadow-sm overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 uppercase tracking-widest font-bold text-gray-400 text-[10px]">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items count</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Paid status</th>
                  <th className="p-4 text-center">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-sans">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold select-all text-black">{order._id.substring(12)}...</td>
                    <td className="p-4 font-semibold text-black">
                      {order.user?.name || 'Deleted Account'}
                      <span className="block text-[10px] text-gray-400 mt-0.5">{order.user?.email}</span>
                    </td>
                    <td className="p-4 text-gray-500 font-medium">{order.orderItems.length} products</td>
                    <td className="p-4 font-bold text-black text-right">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded ${
                        order.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {order.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="border border-gray-200 p-1.5 text-xs outline-none focus:border-gold font-sans font-semibold text-black"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal Dialog Overlay */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative font-sans">
            
            <h2 className="text-xl font-bold uppercase tracking-wider text-black font-serif border-b border-gray-100 pb-4 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            {formSuccess && (
              <div className="bg-green-50 text-green-600 text-xs p-3 rounded font-bold mb-4 flex items-center">
                <Check size={16} className="mr-2" /> Product saved successfully!
              </div>
            )}
            {formError && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded font-bold mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleProductSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {['S', 'M', 'L', 'XL', 'One Size'].map((size) => (
                    <label key={size} className="flex items-center cursor-pointer select-none text-xs">
                      <input
                        type="checkbox"
                        checked={prodSizes.includes(size)}
                        onChange={() => handleSizeToggle(size)}
                        className="mr-2 h-4 w-4 accent-gold"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Multiple Image URLs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400">Product Image URLs</label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-[10px] uppercase tracking-wider font-bold text-gold hover:text-gold-dark"
                  >
                    + Add Image URL
                  </button>
                </div>
                <div className="space-y-2">
                  {prodImages.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        required={idx === 0}
                        value={img}
                        onChange={(e) => updateImageField(idx, e.target.value)}
                        className="flex-1 border border-gray-200 p-2 text-xs outline-none focus:border-gold"
                      />
                      <button
                        type="button"
                        disabled={prodImages.length === 1}
                        onClick={() => removeImageField(idx)}
                        className="p-2 border border-gray-200 text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Product Description</label>
                <textarea
                  rows="4"
                  required
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold resize-none"
                  placeholder="Premium details about styling, material, patterns..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="btn-gold-outline py-3 px-6 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold py-3 px-6 text-xs font-semibold"
                >
                  Save Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
