'use client';
import { API_URL } from '../../utils/api';


import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiEdit2, FiCheck, FiLogOut, FiCalendar } from 'react-icons/fi';

function ProfileContent() {
  const { user, token, logout, updateProfile } = useAuth();
  const { wishlistItems } = useWishlist();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Form Edit States
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  

  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=profile');
    }
  }, [token, router]);

  // Synchronize Tab from URL params
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Load Form data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setZipCode(user.address.zipCode || '');
      }
    }
  }, [user]);

  // Fetch Order History
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (activeTab === 'orders' && token) {
        setLoadingOrders(true);
        try {
          const response = await axios.get(`${API_URL}/orders/my-orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    fetchOrderHistory();
  }, [activeTab, token, API_URL]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    try {
      const payload = {
        name,
        email,
        address: { street, city, state, zipCode, country: 'India' }
      };
      await updateProfile(payload);
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert(error || 'Failed to update profile');
    }
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  // Helpers to color order status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Pending':
      default:
        return 'bg-purple-50 text-purple-700 border border-purple-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Sidebar navigation tab list */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 text-center space-y-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-primary text-2xl font-bold">
              {name ? name.charAt(0).toUpperCase() : <FiUser />}
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-purple-950 truncate">{name || 'Customer'}</h2>
              <p className="text-xs text-purple-400 font-semibold truncate mt-0.5">+{user.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-2 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-colors ${
                activeTab === 'profile'
                  ? 'bg-primary text-white'
                  : 'text-purple-950 hover:bg-purple-50'
              }`}
            >
              <FiUser size={18} />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-colors ${
                activeTab === 'orders'
                  ? 'bg-primary text-white'
                  : 'text-purple-950 hover:bg-purple-50'
              }`}
            >
              <FiShoppingBag size={18} />
              <span>Order History</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-primary text-white'
                  : 'text-purple-950 hover:bg-purple-50'
              }`}
            >
              <FiHeart size={18} />
              <span>Wishlist Bookmarks</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
            >
              <FiLogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Side: Tab Panel Panels */}
        <div className="lg:col-span-9">
          
          {/* Tab 1: Profile Details Form */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-purple-50">
                <h3 className="font-display font-extrabold text-lg text-purple-950">Profile Settings</h3>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-primary text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    <FiEdit2 size={12} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <FiCheck size={16} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      disabled={!editMode}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm disabled:opacity-60 text-purple-950 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      disabled={!editMode}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm disabled:opacity-60 text-purple-950 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-purple-50">
                  <div className="flex items-center gap-2 mb-2 text-purple-900 font-bold text-sm">
                    <FiMapPin size={16} />
                    <span>Shipping Address Address</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Street Address</label>
                    <input
                      type="text"
                      disabled={!editMode}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="House No, Street name"
                      className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm disabled:opacity-60 text-purple-950 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">City</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm disabled:opacity-60 text-purple-950 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">State</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm disabled:opacity-60 text-purple-950 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Pin Code</label>
                      <input
                        type="text"
                        disabled={!editMode}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Pin Code"
                        className="w-full px-3.5 py-2.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm disabled:opacity-60 text-purple-950 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="flex gap-3 justify-end pt-4 border-t border-purple-50">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow"
                    >
                      Save Settings
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Tab 2: Orders List */}
          {activeTab === 'orders' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
              <h3 className="font-display font-extrabold text-lg text-purple-950 pb-4 border-b border-purple-50">
                Order History
              </h3>

              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2].map(n => (
                    <div key={n} className="bg-purple-50 h-28 rounded-2xl animate-pulse-slow" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-purple-400 italic">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-purple-100 rounded-3xl p-5 shadow-sm space-y-4">
                      
                      {/* Order Info Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-50 pb-3 gap-3">
                        <div>
                          <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                            Order ID: <span className="font-mono text-purple-900 font-extrabold">{order.orderId}</span>
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-semibold mt-1">
                            <FiCalendar />
                            <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.paymentStatus === 'Paid' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="divide-y divide-purple-50">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-3 flex gap-4 items-center">
                            <img src={item.image} alt={item.name} className="w-12 h-15 object-cover object-top rounded-lg border border-purple-50 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-bold text-purple-950 truncate leading-snug">{item.name}</h4>
                              <p className="text-xs text-purple-400 mt-1 font-semibold">
                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                              </p>
                            </div>
                            <span className="font-display font-extrabold text-sm text-purple-950 shrink-0">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Totals Row */}
                      <div className="pt-3 border-t border-purple-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-semibold text-purple-900">
                        <div>
                          <p>Payment Method: <span className="text-purple-950 font-bold">{order.paymentMethod}</span></p>
                          {order.whatsappOrdered && <p className="text-[10px] text-emerald-600 mt-0.5">✓ Ordered via WhatsApp</p>}
                        </div>
                        <div className="text-right flex items-baseline gap-1">
                          <span>Total Amount:</span>
                          <span className="font-display font-extrabold text-base text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Wishlist Bookmarks */}
          {activeTab === 'wishlist' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
              <h3 className="font-display font-extrabold text-lg text-purple-950 pb-4 border-b border-purple-50">
                My Wishlist ({wishlistItems.length})
              </h3>

              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-purple-400 italic">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {wishlistItems.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
