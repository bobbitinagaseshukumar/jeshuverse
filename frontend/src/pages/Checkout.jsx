import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  // Form Fields
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [mobile, setMobile] = useState(userInfo?.mobile || '');
  const [address, setAddress] = useState(userInfo?.address || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postal, setPostal] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 1500 ? 0 : 99;
  const totalPrice = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullShippingAddress = `${address}, ${city}, ${state} - ${postal}`;

    try {
      // 1. Create payment order on backend
      const { data: orderData } = await api.post('/payments/order', { amount: totalPrice });

      // Check if it is a mock order (keys not configured on backend)
      if (orderData.mock) {
        console.log('Payment keys unconfigured. Simulating mock transaction success.');
        
        // Directly verify mock payment on backend
        await api.post('/payments/verify', {
          razorpay_order_id: orderData.id,
          razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
          mock: true,
        });

        // Create the actual order in DB
        const { data: dbOrder } = await api.post('/orders', {
          orderItems: cartItems,
          shippingAddress: fullShippingAddress,
          totalPrice,
          paymentResult: {
            id: 'pay_mock_' + Math.random().toString(36).substring(2, 10),
            orderId: orderData.id,
            status: 'Success',
          },
        });

        clearCart();
        navigate(`/order-success?id=${dbOrder._id}`);
        return;
      }

      // 2. Configure real Razorpay options
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';
      
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'JeshuVerse',
        description: 'JeshuVerse Order Checkout Payment',
        image: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E✨%3C/text%3E%3C/svg%3E',
        order_id: orderData.id,
        prefill: {
          name,
          email,
          contact: mobile,
        },
        theme: {
          color: '#D4AF37', // metallic gold theme for Razorpay overlay
        },
        handler: async function (response) {
          try {
            // Verify payment signature
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // If signature verification succeeded, save the order
            const { data: dbOrder } = await api.post('/orders', {
              orderItems: cartItems,
              shippingAddress: fullShippingAddress,
              totalPrice,
              paymentResult: {
                id: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: 'Success',
                signature: response.razorpay_signature,
              },
            });

            clearCart();
            navigate(`/order-success?id=${dbOrder._id}`);
          } catch (err) {
            console.error('Payment verify error:', err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp1.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Error processing checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-8 font-serif">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-4 border border-red-100 mb-6 font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Delivery Address Details - Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-gray-100 p-6 space-y-4 bg-white shadow-sm">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-gray-100 pb-3 flex items-center">
              <Truck size={16} className="text-gold mr-2" /> Shipping Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Address Lane</label>
              <input
                type="text"
                required
                placeholder="Apartment, building, street, area details..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Checkout Order Summary - Right */}
        <div className="bg-gray-50 border border-gray-100 p-6 self-start space-y-6">
          <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-gray-200 pb-3 flex items-center">
            <ShoppingBag size={16} className="text-gold mr-2" /> Order Review
          </h3>

          {/* Item Mini list */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={`${item.product}-${item.size}`} className="flex justify-between items-center text-xs">
                <div className="min-w-0 pr-3">
                  <span className="font-semibold text-black truncate block">{item.name}</span>
                  <span className="text-[9px] text-gray-400 uppercase">Size: {item.size} • Qty: {item.qty}</span>
                </div>
                <span className="font-medium text-black shrink-0">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Items Total</span>
              <span className="font-semibold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="font-semibold text-black">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-bold text-black">
              <span>Amount Payable</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gold hover:text-black transition-colors duration-300 flex items-center justify-center font-bold text-xs py-4 tracking-widest uppercase border border-black hover:border-gold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <CreditCard size={14} className="mr-2" />
            {loading ? 'Processing Payment...' : 'Pay Online Now'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
