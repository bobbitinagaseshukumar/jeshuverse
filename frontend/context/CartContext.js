'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('jv_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('jv_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isHydrated]);

  // Add to cart
  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    setCartItems((prevItems) => {
      // Find if item with same ID, size, and color exists
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.product === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const newQty = newItems[existingItemIndex].quantity + quantity;
        
        // Ensure not exceeding stock quantity
        if (newQty > product.stockQuantity) {
          alert(`Cannot add more items. Max available stock is ${product.stockQuantity}`);
          return prevItems;
        }

        newItems[existingItemIndex].quantity = newQty;
        return newItems;
      } else {
        // Double check stock quantity
        if (quantity > product.stockQuantity) {
          alert(`Cannot add item. Max available stock is ${product.stockQuantity}`);
          return prevItems;
        }

        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: itemPrice,
            originalPrice: product.price,
            size: selectedSize,
            color: selectedColor,
            quantity,
            stockQuantity: product.stockQuantity
          }
        ];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId, size = '', color = '') => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product === productId && item.size === size && item.color === color)
      )
    );
  };

  // Update quantity
  const updateQuantity = (productId, quantity, size = '', color = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product === productId && item.size === size && item.color === color) {
          if (quantity > item.stockQuantity) {
            alert(`Only ${item.stockQuantity} items available in stock.`);
            return { ...item, quantity: item.stockQuantity };
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
