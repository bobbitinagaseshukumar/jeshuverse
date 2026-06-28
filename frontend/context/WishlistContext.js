'use client';
import { API_URL } from '../utils/api';


import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user, token } = useAuth();
  

  // Fetch wishlist from database if logged in, else from local storage
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && token) {
        try {
          const response = await axios.get(`${API_URL}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWishlistItems(response.data);
        } catch (error) {
          console.warn('Error fetching wishlist:', error.message || error);
        }
      } else {
        const storedWishlist = localStorage.getItem('jv_wishlist');
        if (storedWishlist) {
          try {
            setWishlistItems(JSON.parse(storedWishlist));
          } catch (e) {
            console.error('Error parsing guest wishlist:', e);
          }
        }
      }
    };

    fetchWishlist();
  }, [user, token, API_URL]);

  // Toggle wishlist item
  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    
    if (user && token) {
      try {
        const response = await axios.post(`${API_URL}/wishlist/toggle`, { productId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistItems(response.data.products);
      } catch (error) {
        console.error('Error toggling wishlist item:', error);
      }
    } else {
      // Guest mode - toggle in local state and localStorage
      setWishlistItems((prevItems) => {
        const exists = prevItems.some(item => item._id === productId);
        let updated;
        
        if (exists) {
          updated = prevItems.filter(item => item._id !== productId);
        } else {
          updated = [...prevItems, product];
        }
        
        localStorage.setItem('jv_wishlist', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
