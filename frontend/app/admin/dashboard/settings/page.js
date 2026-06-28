'use client';
import { API_URL } from '../../../../utils/api';


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { FiSave, FiSettings, FiCheck, FiUploadCloud } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const { token } = useAuth();
  
  // Settings States
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [shippingCharges, setShippingCharges] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [womenCategoryPic, setWomenCategoryPic] = useState('');
  const [menCategoryPic, setMenCategoryPic] = useState('');
  const [kidsCategoryPic, setKidsCategoryPic] = useState('');
  const [jewelleryCategoryPic, setJewelleryCategoryPic] = useState('');
  const [slide1Image, setSlide1Image] = useState('');
  const [slide2Image, setSlide2Image] = useState('');
  const [slide3Image, setSlide3Image] = useState('');
  
  // Security Credentials States
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Promote User States
  const [promotePhone, setPromotePhone] = useState('');
  const [promoteSuccess, setPromoteSuccess] = useState('');
  const [promoteError, setPromoteError] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingState, setUploadingState] = useState({});

  const handleFieldImageUpload = async (e, fieldKey, fieldSetter) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingState((prev) => ({ ...prev, [fieldKey]: true }));
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const response = await axios.post(`${API_URL}/products/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.urls && response.data.urls.length > 0) {
        fieldSetter(response.data.urls[0]);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingState((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  const ImageSettingField = ({ label, value, fieldKey, onChange, setter }) => {
    const isUploading = uploadingState[fieldKey];
    return (
      <div className="bg-purple-50/20 p-4.5 rounded-2xl border border-purple-100/50 space-y-3">
        <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block">{label}</label>
        
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="w-16 h-20 rounded-xl overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 shadow-sm relative group">
            {value ? (
              <img src={value} alt={label} className="w-full h-full object-cover object-top" />
            ) : (
              <FiUploadCloud size={20} className="text-purple-300 animate-pulse" />
            )}
          </div>

          {/* Upload Action */}
          <div className="flex-1 space-y-2">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={(e) => handleFieldImageUpload(e, fieldKey, setter)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button
                type="button"
                disabled={isUploading}
                className="px-4 py-2 border border-purple-100 hover:border-purple-300 text-xs font-bold text-purple-950 bg-white rounded-xl shadow-sm hover:shadow transition-all w-full text-center"
              >
                {isUploading ? 'Uploading...' : value ? 'Change Gallery Photo' : 'Upload from Gallery'}
              </button>
            </div>
            
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e)}
              placeholder="Or paste direct image URL"
              className="w-full px-3 py-1.5 bg-purple-50/20 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-lg text-[10px] text-purple-950 placeholder-purple-300 font-medium"
            />
          </div>
        </div>
      </div>
    );
  };

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
        setStoreAddress(data.storeAddress || 'Banumukkala, Nandyal');
        setWomenCategoryPic(data.womenCategoryPic || '');
        setMenCategoryPic(data.menCategoryPic || '');
        setKidsCategoryPic(data.kidsCategoryPic || '');
        setJewelleryCategoryPic(data.jewelleryCategoryPic || '');
        setSlide1Image(data.slide1Image || '');
        setSlide2Image(data.slide2Image || '');
        setSlide3Image(data.slide3Image || '');
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
        adminUsername,
        storeAddress,
        womenCategoryPic,
        menCategoryPic,
        kidsCategoryPic,
        jewelleryCategoryPic,
        slide1Image,
        slide2Image,
        slide3Image,
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

          <div>
            <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Store Footer Address</label>
            <input
              type="text"
              required
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="e.g. Banumukkala, Nandyal"
              className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 font-medium"
            />
            <p className="text-[9px] text-purple-400 mt-1.5">*This address will be loaded dynamically in the website footer.</p>
          </div>
        </div>
        {/* Section 1.5: Homepage Banner Slider and Category Pics Settings */}
        <div className="space-y-4 pt-4 border-t border-purple-50">
          <div className="flex items-center gap-2 text-sm font-bold text-purple-950 uppercase tracking-wide border-b border-purple-50 pb-2">
            <FiSettings className="text-primary" />
            <span>Store Photos & Slider Banners</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageSettingField
              label="Women's Category Image"
              value={womenCategoryPic}
              fieldKey="womenCategoryPic"
              onChange={setWomenCategoryPic}
              setter={setWomenCategoryPic}
            />

            <ImageSettingField
              label="Men's Category Image"
              value={menCategoryPic}
              fieldKey="menCategoryPic"
              onChange={setMenCategoryPic}
              setter={setMenCategoryPic}
            />

            <ImageSettingField
              label="Kids' Category Image"
              value={kidsCategoryPic}
              fieldKey="kidsCategoryPic"
              onChange={setKidsCategoryPic}
              setter={setKidsCategoryPic}
            />

            <ImageSettingField
              label="Jewellery Category Image"
              value={jewelleryCategoryPic}
              fieldKey="jewelleryCategoryPic"
              onChange={setJewelleryCategoryPic}
              setter={setJewelleryCategoryPic}
            />
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Homepage Slideshow Banners</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageSettingField
                label="Hero Slider Slide 1 (Jewellery)"
                value={slide1Image}
                fieldKey="slide1Image"
                onChange={setSlide1Image}
                setter={setSlide1Image}
              />

              <ImageSettingField
                label="Hero Slider Slide 2 (Women's Wear)"
                value={slide2Image}
                fieldKey="slide2Image"
                onChange={setSlide2Image}
                setter={setSlide2Image}
              />

              <ImageSettingField
                label="Hero Slider Slide 3 (Men's Wear)"
                value={slide3Image}
                fieldKey="slide3Image"
                onChange={setSlide3Image}
                setter={setSlide3Image}
              />
            </div>
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
