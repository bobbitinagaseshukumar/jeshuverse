'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckoutClick = () => {
    if (!user) {
      // Redirect to login, then redirect back to checkout
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  const shippingPrice = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 50;
  const totalPrice = cartSubtotal + shippingPrice;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-md mx-auto shadow-lg shadow-black/20 py-12">
          <div className="text-4xl mb-4 text-gray-400">🛒</div>
          <h2 className="font-display font-extrabold text-xl text-white">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 leading-relaxed mt-2.5">
            Looks like you haven't added any premium clothing or jewellery styles yet.
          </p>
          <NextLink
            href="/category/all"
            className="mt-6 inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            <FiShoppingBag size={14} />
            <span>Start Shopping</span>
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-8 border-b border-white/10 pb-4">
        Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item, index) => (
            <div 
              key={`${item.product}-${item.size}-${item.color}-${index}`}
              className="bg-[#111] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg shadow-black/20 flex gap-4 sm:gap-6 items-center"
            >
              {/* Product Thumbnail */}
              <NextLink href={`/product/${item.product}`} className="w-16 sm:w-20 aspect-[4/5] bg-[#0d0d0d] rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
              </NextLink>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <NextLink href={`/product/${item.product}`}>
                  <h3 className="font-display font-bold text-sm sm:text-base text-white hover:text-primary truncate transition-colors">
                    {item.name}
                  </h3>
                </NextLink>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1 font-semibold">
                  {item.size && <span>Size: <span className="text-white uppercase">{item.size}</span></span>}
                  {item.color && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>Color: <span className="text-white">{item.color}</span></span>
                    </>
                  )}
                </div>
                <div className="mt-2.5 font-display font-extrabold text-sm sm:text-base text-white">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity Changer */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <div className="flex items-center border border-white/10 rounded-xl bg-white/5">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1, item.size, item.color)}
                    className="p-2 text-xs font-bold text-gray-200 hover:text-primary focus:outline-none"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1, item.size, item.color)}
                    className="p-2 text-xs font-bold text-gray-200 hover:text-primary focus:outline-none"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product, item.size, item.color)}
                  className="p-2 text-red-500 hover:bg-red-950/30 hover:text-red-400 rounded-xl transition-all"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-[#111] p-6 rounded-3xl border border-white/10 shadow-lg shadow-black/20 h-fit space-y-5">
          <h3 className="font-display font-extrabold text-white text-lg border-b border-white/5 pb-3">
            Price Details
          </h3>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-gray-200 font-medium">
              <span>Price ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-200 font-medium">
              <span>Delivery Charges</span>
              {shippingPrice === 0 ? (
                <span className="text-emerald-400 font-bold">FREE Delivery</span>
              ) : (
                <span>₹{shippingPrice}</span>
              )}
            </div>
            {shippingPrice > 0 && (
              <p className="text-[10px] text-amber-400 font-semibold bg-amber-950/30 p-2 rounded-lg">
                💡 Add ₹{499 - cartSubtotal} more items to unlock Free Delivery!
              </p>
            )}

            <div className="border-t border-white/10 pt-3.5 flex justify-between font-display font-extrabold text-base sm:text-lg text-white">
              <span>Total Amount</span>
              <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handleCheckoutClick}
            className="w-full flex items-center justify-center gap-1.5 py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-xl shadow-black/30 transition-colors"
          >
            <span>Proceed to Checkout</span>
            <FiArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
