'use client';
import { API_URL } from '../../utils/api';


import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiMapPin, FiPhone, FiUser, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaMobileAlt, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';
  
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user, token } = useAuth();

  // Shipping Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PhonePe');

  // Checkout Processing States
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // PhonePe Payment Session States
  const [paymentSession, setPaymentSession] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  

  // Load items to check out
  useEffect(() => {
    if (!token) {
      router.push('/login?redirect=checkout');
      return;
    }

    // Prefill shipping details from user profile
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      if (user.address) {
        if (typeof user.address === 'string') {
          try {
            const parsed = JSON.parse(user.address);
            if (parsed && typeof parsed === 'object') {
              setStreet(parsed.street || '');
              setCity(parsed.city || '');
              setState(parsed.state || '');
              setZipCode(parsed.zipCode || '');
            } else {
              setStreet(user.address);
            }
          } catch (e) {
            setStreet(user.address);
          }
        } else if (typeof user.address === 'object') {
          setStreet(user.address.street || '');
          setCity(user.address.city || '');
          setState(user.address.state || '');
          setZipCode(user.address.zipCode || '');
        }
      }
    }

    if (isBuyNow) {
      const buyNowItem = sessionStorage.getItem('jv_buy_now');
      if (buyNowItem) {
        const parsed = JSON.parse(buyNowItem);
        setOrderItems([parsed]);
        setOrderTotal(parsed.price * parsed.quantity);
      } else {
        router.push('/cart');
      }
    } else {
      setOrderItems(cartItems);
      setOrderTotal(cartSubtotal);
    }
  }, [isBuyNow, cartItems, cartSubtotal, token, user]);

  const shippingCharges = orderTotal >= 499 || orderTotal === 0 ? 0 : 50;
  const grandTotal = orderTotal + shippingCharges;

  // Handle Order Placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name || !phone || !street || !city || !state || !zipCode) {
      alert('Please fill in all shipping details');
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = { name, phone, street, city, state, zipCode, country: 'India' };
      const itemsPayload = orderItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      }));

      // Create Order
      const response = await axios.post(`${API_URL}/orders`, {
        items: itemsPayload,
        shippingAddress,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orderData = response.data;
      setPlacedOrder(orderData);

      // Handle Checkout Flow based on Payment Method
      if (paymentMethod === 'PhonePe') {
        // Create PhonePe Dynamic QR Session
        const payResponse = await axios.post(`${API_URL}/payments/create-session`, {
          orderId: orderData.orderId || orderData.id || orderData._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPaymentSession(payResponse.data);
      } else {
        // COD / WhatsApp Checkout directly forwards to success screen
        if (!isBuyNow) clearCart();
        router.push(`/order-success?orderId=${orderData.orderId || orderData.id || orderData._id}`);
      }

    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  // Simulate Payment Success / Failure Callback
  const handleSimulatePayment = async (status) => {
    if (!paymentSession) return;
    
    setVerifyingPayment(true);
    try {
      const response = await axios.post(`${API_URL}/payments/verify`, {
        transactionId: paymentSession.transactionId,
        status: status // 'Success' or 'Failed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!isBuyNow) clearCart();

      if (status === 'Success') {
        router.push(`/order-success?orderId=${placedOrder.orderId || placedOrder.id || placedOrder._id}`);
      } else {
        router.push(`/payment-failure?orderId=${placedOrder.orderId || placedOrder.id || placedOrder._id}`);
      }
    } catch (error) {
      console.error(error);
      alert('Simulation error');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Checkout Wizard Overlay */}
      {paymentSession ? (
        
        /* Step 2: UPI / PhonePe Dynamic QR payment Screen */
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-purple-100 shadow-2xl p-6 sm:p-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <FaMobileAlt size={32} className="text-purple-600 fill-purple-600" />
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-purple-950">
              PhonePe Payment
            </h2>
          </div>

          <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Total Amount Payable</span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-primary mt-1 block">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Render dynamic base64 QR Code */}
          <div className="bg-white p-3 border border-purple-100 rounded-3xl w-fit mx-auto shadow-sm">
            <img 
              src={paymentSession.qrCodeDataUrl} 
              alt="Scan QR code using PhonePe" 
              className="w-60 h-60 object-contain"
            />
          </div>

          <p className="text-xs text-purple-900 font-semibold px-4">
            Scan QR code using PhonePe, GPay, Paytm, or any UPI app to complete payment.
          </p>

          {/* Deep link button for mobile screens */}
          <a
            href={paymentSession.upiUri}
            className="w-full py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-md transition-colors block text-sm"
          >
            Tap to Pay on Mobile
          </a>

          {/* Simulated gateway options */}
          <div className="pt-6 border-t border-purple-100 space-y-4">
            <div className="flex items-center gap-1.5 justify-center text-amber-600 text-xs font-semibold bg-amber-50 p-3 rounded-xl">
              <FiInfo shrink-0 size={14} />
              <span>Developer mode: Simulate payment resolution below</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSimulatePayment('Success')}
                disabled={verifyingPayment}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <FiCheckCircle size={14} />
                <span>Simulate Success</span>
              </button>

              <button
                onClick={() => handleSimulatePayment('Failed')}
                disabled={verifyingPayment}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <FiXCircle size={14} />
                <span>Simulate Failure</span>
              </button>
            </div>
          </div>
        </div>

      ) : (
        
        /* Step 1: Address and Payment Method Selection */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form details */}
          <div className="lg:col-span-8">
            <form onSubmit={handlePlaceOrder} className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 pb-4 border-b border-purple-50">
                <FiMapPin className="text-primary" size={22} />
                <h2 className="font-display font-extrabold text-lg sm:text-xl text-purple-950">
                  Shipping & Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priyanika Sharma"
                      className="w-full pl-9 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                    />
                    <FiUser className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                    />
                    <FiPhone className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House No, Apartment Name, Street Name"
                  className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Pin Code</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g. 560001"
                    className="w-full px-3.5 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-6 border-t border-purple-50 space-y-4">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Select Payment Method</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PhonePe Radio */}
                  <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'PhonePe'
                      ? 'border-primary bg-purple-50/30'
                      : 'border-purple-100 hover:border-purple-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="PhonePe"
                        checked={paymentMethod === 'PhonePe'}
                        onChange={() => setPaymentMethod('PhonePe')}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="text-left">
                        <span className="text-sm font-bold text-purple-950 block">PhonePe UPI</span>
                        <span className="text-[10px] text-purple-400">Scan QR Code or UPI tap</span>
                      </div>
                    </div>
                    <FaMobileAlt size={24} className="text-purple-600 fill-purple-600 shrink-0" />
                  </label>

                  {/* COD Radio */}
                  <label className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-primary bg-purple-50/30'
                      : 'border-purple-100 hover:border-purple-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="text-left">
                        <span className="text-sm font-bold text-purple-950 block">Cash On Delivery</span>
                        <span className="text-[10px] text-purple-400">Pay when order arrives</span>
                      </div>
                    </div>
                    <FaMoneyBillWave size={22} className="text-emerald-600 shrink-0" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-md transition-colors mt-6 uppercase text-sm tracking-wider"
              >
                {loading ? 'Processing Checkout...' : `Confirm & Place Order • ₹${grandTotal.toLocaleString('en-IN')}`}
              </button>

            </form>
          </div>

          {/* Right Column: Checkout Summary Box */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm h-fit space-y-5">
            <h3 className="font-display font-extrabold text-purple-950 text-base border-b border-purple-50 pb-3">
              Order Review
            </h3>
            
            <div className="divide-y divide-purple-50 max-h-72 overflow-y-auto no-scrollbar">
              {orderItems.map((item, index) => (
                <div key={index} className="py-3 flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-11 h-14 object-cover object-top rounded-lg shrink-0 border border-purple-50" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-purple-950 truncate">{item.name}</h4>
                    <p className="text-[10px] text-purple-400 mt-0.5">Qty: {item.quantity} • Size: {item.size || 'N/A'}</p>
                    <p className="text-xs font-extrabold text-purple-950 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-purple-100 pt-4 space-y-2 text-xs font-semibold text-purple-900">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Shipping</span>
                <span>{shippingCharges === 0 ? 'FREE' : `₹${shippingCharges}`}</span>
              </div>
              <div className="border-t border-purple-100 pt-3 flex justify-between font-display font-extrabold text-sm sm:text-base text-purple-950">
                <span>Grand Total</span>
                <span className="text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
