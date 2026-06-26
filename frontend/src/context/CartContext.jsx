import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, qty = 1) => {
    setCartItems((prevItems) => {
      // Look for match of both ID and size
      const existsIndex = prevItems.findIndex(
        (item) => item.product === product._id && item.size === size
      );

      if (existsIndex > -1) {
        const updated = [...prevItems];
        // Ensure we do not exceed stock quantity
        const newQty = updated[existsIndex].qty + qty;
        updated[existsIndex].qty = Math.min(newQty, product.stock);
        return updated;
      }

      // Add as new item
      return [
        ...prevItems,
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          stock: product.stock,
          size,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product === productId && item.size === size))
    );
  };

  const updateQty = (productId, size, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId && item.size === size
          ? { ...item, qty: Math.min(Math.max(1, qty), item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
