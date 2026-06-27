'use client';
import { API_URL } from '../../../../utils/api';


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { FiSave, FiSettings, FiCheck } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const { token } = useAuth();
  
  // Settings States
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [shippingCharges, setShippingCharges] = useState('');
  
  // Security Credentials States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Promote User States
  const [promotePhone, setPromotePhone] = useState('');
  const [promoteSuccess, setPromoteSuccess] = useState('');
  const [promoteError, setPromoteError] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        setWhatsappNumber(data.whatsappNumber || '');
        setUpiId(data.upiId || '');
        setMerchantName(data.merchantName || '');
        setShippingCharges(data.shippingCharges || 50);
        setAdminUsername(data.adminUsername || 'admin');
      } catch (error) {
        console.error('Error fetching admin settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token, API_URL]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    try {
      const payload = {
        whatsappNumber,
        upiId,
        merchantName,
        shippingCharges: Number(shippingCharges),
        adminUsername
      };

      if (adminPassword && adminPassword !== '') {
        payload.adminPassword = adminPassword;
      }

      await axios.put(`${API_URL}/admin/settings`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSaveSuccess(true);
      setAdminPassword(''); // Clear password field after save
      setTimeout(() => setSaveSuccess(false), 3000);
      alert('Settings updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update settings');
    }
  };

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    setPromoteSuccess('');
    setPromoteError('');
    if (!promotePhone || promotePhone.length < 10) {
      setPromoteError('Please enter a valid phone number');
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/admin/promote`, { phone: promotePhone }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromoteSuccess(response.data.message);
      setPromotePhone('');
    } catch (error) {
      setPromoteError(error.response?.data?.message || 'Error promoting user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="border-b border-purple-100 pb-4">
        <h1 className="font-display font-extrabold text-2xl text-purple-950">Store Configurations</h1>
        <p className="text-xs text-purple-400 font-semibold mt-1">Configure checkout integrations and security codes</p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <FiCheck size={16} />
          <span>Configurations updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSettingsSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100/75 shadow-sm space-y-6">
        
        {/* Section 1: WhatsApp Checkout Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-950 uppercase tracking-wide border-b border-purple-50 pb-2">
            <FiSettings className="text-primary" />
            <span>WhatsApp Ordering Settings</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Owner WhatsApp Number</label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
            />
            <p className="text-[9px] text-purple-400 mt-1.5">*Must include country code without symbols (e.g. 91 for India followed by mobile number).</p>
          </div>
        </div>

        {/* Section 2: UPI QR Settings */}
        <div className="space-y-4 pt-4 border-t border-purple-50">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-950 uppercase tracking-wide border-b border-purple-50 pb-2">
            <FiSettings className="text-primary" />
            <span>PhonePe / UPI Gateway Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Merchant Payee UPI ID</label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. jeshuverse@upi"
                className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Merchant Name (Payee Name)</label>
              <input
                type="text"
                required
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="e.g. JeshuVerse Store"
                className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Delivery Shipping Fee (₹)</label>
            <input
              type="number"
              required
              min={0}
              value={shippingCharges}
              onChange={(e) => setShippingCharges(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
            />
          </div>
        </div>

        {/* Section 3: Credentials Settings */}
        <div className="space-y-4 pt-4 border-t border-purple-50">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-950 uppercase tracking-wide border-b border-purple-50 pb-2">
            <FiSettings className="text-primary" />
            <span>Admin Authentication settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Admin Username</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Admin New Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
              />
              <p className="text-[8px] text-purple-400 mt-1">*Leave blank to keep current password.</p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-6 border-t border-purple-50 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-md transition-colors"
          >
            <FiSave size={18} />
            <span>Save Configurations</span>
          </button>
        </div>

      </form>

      {/* Promotion Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100/75 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-purple-950 uppercase tracking-wide border-b border-purple-50 pb-2">
          <FiSettings className="text-primary" />
          <span>Add Admin / Owner Access</span>
        </div>

        <p className="text-xs text-purple-400 font-semibold leading-relaxed">
          Type the mobile number of a registered customer to promote them to the Owner/Admin role.
        </p>

        {promoteSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl">
            {promoteSuccess}
          </div>
        )}

        {promoteError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">
            {promoteError}
          </div>
        )}

        <form onSubmit={handlePromoteSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">User Phone Number</label>
            <div className="flex gap-2">
              <input
                type="tel"
                required
                value={promotePhone}
                onChange={(e) => setPromotePhone(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs text-purple-950 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow-sm shrink-0"
              >
                Grant Access
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
