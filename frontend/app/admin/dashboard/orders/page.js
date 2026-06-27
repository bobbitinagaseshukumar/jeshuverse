'use client';
import { API_URL } from '../../../../utils/api';


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { FiCheck, FiRefreshCw, FiCalendar, FiClock } from 'react-icons/fi';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, API_URL]);

  // Update order status on select change
  const handleStatusChange = async (orderId, updates) => {
    setUpdatingId(orderId);
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state local list
      setOrders(orders.map((ord) => (ord._id === orderId ? { ...ord, ...response.data } : ord)));
      alert('Order status updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="border-b border-purple-100 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-purple-950">Orders Manager</h1>
        <p className="text-xs text-purple-400 font-semibold mt-1">Track payments, shipping, delivery and order cancellation logs</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-purple-100 p-8 text-center text-purple-400 italic text-sm">
          No customer orders found in logs.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-purple-100/75 shadow-sm rounded-3xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              
              {/* Left Col: Order identification (col-4) */}
              <div className="lg:col-span-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Order Reference</p>
                  <p className="font-mono text-base font-extrabold text-purple-950 mt-0.5">{order.orderId}</p>
                </div>

                <div className="text-xs text-purple-900 font-semibold space-y-1">
                  <p className="flex items-center gap-1.5 text-[10px] text-purple-400">
                    <FiCalendar /> Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                  <p className="pt-2">Customer Name: <span className="font-bold text-purple-950">{order.user?.name || 'Anonymous'}</span></p>
                  <p>Contact Phone: <span className="font-bold text-purple-950">+{order.user?.phone || order.shippingAddress.phone}</span></p>
                  <p className="text-[11px] leading-relaxed text-purple-400 font-medium pt-1.5">
                    Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>

              {/* Center Col: Items summary list (col-4) */}
              <div className="lg:col-span-4 space-y-2 divide-y divide-purple-50">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest pb-1">Items Choices</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center gap-2">
                    <img src={item.image} alt="" className="w-8 h-10 object-cover object-top rounded border border-purple-50 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-purple-950 truncate">{item.name}</p>
                      <p className="text-[9px] text-purple-400 font-semibold mt-0.5">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                    </div>
                    <span className="font-display font-extrabold text-xs text-purple-950 shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                
                <div className="pt-2 flex justify-between font-display font-extrabold text-xs text-purple-950 uppercase tracking-wide">
                  <span>Grand Total</span>
                  <span className="text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Right Col: Fulfillment operations selectors (col-4) */}
              <div className="lg:col-span-4 bg-purple-50/25 p-4.5 rounded-2xl border border-purple-100/30 flex flex-col justify-between gap-4">
                
                {/* Method */}
                <div className="flex justify-between items-center text-xs font-semibold text-purple-900 border-b border-purple-100/50 pb-2">
                  <span>Fulfillment Route:</span>
                  <span className="font-bold text-purple-950">{order.paymentMethod} {order.whatsappOrdered && '(WhatsApp)'}</span>
                </div>

                <div className="space-y-3">
                  {/* Order Status */}
                  <div>
                    <label className="text-[9px] font-bold text-purple-400 uppercase tracking-wide block mb-1">Fulfillment Status</label>
                    <select
                      disabled={updatingId === order._id}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, { orderStatus: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-purple-100 rounded-xl text-xs text-purple-950 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="text-[9px] font-bold text-purple-400 uppercase tracking-wide block mb-1">Billing Status</label>
                    <select
                      disabled={updatingId === order._id}
                      value={order.paymentStatus}
                      onChange={(e) => handleStatusChange(order._id, { paymentStatus: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-purple-100 rounded-xl text-xs text-purple-950 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending / Unpaid</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed / Declined</option>
                    </select>
                  </div>
                </div>

                {updatingId === order._id && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
                    <FiRefreshCw size={24} className="animate-spin text-primary" />
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
