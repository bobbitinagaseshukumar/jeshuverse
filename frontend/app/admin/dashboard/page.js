'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiDollarSign, FiLayers, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../utils/api';

export default function AdminDashboardPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) {
        return;
      }

      setLoading(true);
      setErrorMsg('');

      try {
        const response = await axios.get(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.warn('Error loading admin stats:', error.message || error);
        setStats(null);
        if (error.response?.status === 401) {
          logout();
          router.replace('/admin/login');
          return;
        }
        setErrorMsg(error.response?.data?.message || error.message || 'Failed to retrieve dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token, router, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-200">
        {errorMsg || 'Failed to retrieve stats. Make sure backend is running.'}
      </div>
    );
  }

  const totalRevenue = Number(stats.totalRevenue || 0);
  const totalOrders = Number(stats.totalOrders || 0);
  const totalCustomers = Number(stats.totalCustomers || 0);
  const totalProducts = Number(stats.totalProducts || 0);
  const recentOrders = Array.isArray(stats.recentOrders) ? stats.recentOrders : [];
  const statusBreakdown = stats.statusBreakdown || {};

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: FiDollarSign,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
    },
    {
      label: 'Active Customers',
      value: totalCustomers,
      icon: FiUsers,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    {
      label: 'Total Products',
      value: totalProducts,
      icon: FiLayers,
      color: 'bg-purple-50 text-primary border border-purple-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">Dashboard Overview</h1>
        <p className="text-xs text-purple-400 font-semibold mt-1">Real-time metrics for JeshuVerse boutique store</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-3xl border border-purple-100/75 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{card.label}</span>
                <p className="font-display font-extrabold text-2xl text-purple-950">{card.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${card.color}`}>
                <IconComp size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-purple-100/75 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-purple-50">
            <h3 className="font-display font-extrabold text-purple-950 text-base">Recent Orders</h3>
            <span className="px-2 py-0.5 bg-purple-50 text-primary text-[10px] font-bold uppercase rounded-lg">Latest updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-purple-950 divide-y divide-purple-100">
              <thead>
                <tr className="text-purple-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="pb-3.5 pl-2">Order ID</th>
                  <th className="pb-3.5">Customer</th>
                  <th className="pb-3.5">Total Amount</th>
                  <th className="pb-3.5">Payment</th>
                  <th className="pb-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 font-medium">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-purple-400 italic">No orders logged.</td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-purple-50/20">
                      <td className="py-3.5 pl-2 font-mono font-bold text-purple-900">{ord.orderId || ord._id}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-purple-950">{ord.user?.name || 'Customer'}</p>
                        <p className="text-[10px] text-purple-400 font-semibold">{ord.user?.phone ? `+${ord.user.phone}` : 'No phone'}</p>
                      </td>
                      <td className="py-3.5 font-display font-extrabold text-sm text-purple-900">₹{Number(ord.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {ord.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-bold text-primary">{ord.orderStatus || 'Pending'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100/75 shadow-sm space-y-5">
          <div className="pb-3 border-b border-purple-50">
            <h3 className="font-display font-extrabold text-purple-950 text-base">Order Deliveries</h3>
          </div>

          <div className="space-y-3.5">
            {Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center text-xs font-semibold text-purple-900">
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status === 'Delivered' ? 'bg-emerald-500' :
                    status === 'Shipped' ? 'bg-blue-500' :
                    status === 'Processing' ? 'bg-amber-500' :
                    status === 'Cancelled' ? 'bg-red-500' : 'bg-purple-500'
                  }`} />
                  <span>{status}</span>
                </span>
                <span className="font-bold text-purple-950 px-2 py-0.5 bg-purple-50 rounded-lg">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
