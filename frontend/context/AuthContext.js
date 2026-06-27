'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { API_URL } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safely retrieve user data and token from localStorage on mount
    try {
      const storedUser = localStorage.getItem('jv_user');
      const storedToken = localStorage.getItem('jv_token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Failed to parse stored auth user:', error);
      localStorage.removeItem('jv_user');
      localStorage.removeItem('jv_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const parseError = (error, defaultMessage) => {
    if (error.response) {
      return error.response.data?.message || defaultMessage;
    } else if (error.request) {
      return `Could not connect to the backend server at ${API_URL}. Please check if the backend is running.`;
    } else {
      return error.message || defaultMessage;
    }
  };

  // Send OTP
  const sendOtp = async (phone) => {
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { phone });
      return response.data;
    } catch (error) {
      throw parseError(error, 'Failed to send OTP');
    }
  };

  // Verify OTP and Login
  const verifyOtp = async (phone, otp) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
      const { token: userToken, ...userData } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('jv_user', JSON.stringify(userData));
      localStorage.setItem('jv_token', userToken);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      return userData;
    } catch (error) {
      throw parseError(error, 'Invalid OTP');
    }
  };

  // Admin Login
  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/admin-login`, { username, password });
      const { token: adminToken, ...adminData } = response.data;
      
      setUser(adminData);
      setToken(adminToken);
      localStorage.setItem('jv_user', JSON.stringify(adminData));
      localStorage.setItem('jv_token', adminToken);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
      return adminData;
    } catch (error) {
      throw parseError(error, 'Invalid admin credentials');
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jv_user');
    localStorage.removeItem('jv_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { token: userToken, ...userData } = response.data;
      
      setUser(userData);
      localStorage.setItem('jv_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw parseError(error, 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      sendOtp,
      verifyOtp,
      adminLogin,
      logout,
      updateProfile,
      API_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};
