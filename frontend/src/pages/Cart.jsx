import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQty, removeFromCart, getCartTotal } = useContext(CartContext);

  const subtotal = getCartTotal();
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99; // Free above ₹1500
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-full text-gray-300">
            <ShoppingBag size={48} />
          </div>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wide text-black">Your Cart is Empty</h2>
        <p className="text-xs text-gray-400 mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="mt-6 inline-block btn-gold font-bold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-8 font-serif">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List - Left */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.product}-${item.size}`}
              className="flex items-center gap-4 border border-gray-100 p-4 relative bg-white shadow-sm"
            >
              {/* Product Image */}
              <div className="w-20 aspect-[3/4] bg-gray-50 shrink-0 border border-gray-100 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 pr-4">
                <Link
                  to={`/product/${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} // dummy slug fallback
                  className="block text-sm font-medium text-black truncate hover:text-gold"
                >
                  {item.name}
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                  Size: <span className="text-black">{item.size}</span>
                </p>
                <div className="text-xs font-semibold text-black mt-2">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center border border-gray-200 h-9 w-24">
                <button
                  onClick={() => updateQty(item.product, item.size, item.qty - 1)}
                  className="px-2.5 text-gray-400 hover:text-black font-semibold text-sm"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-medium">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.product, item.size, item.qty + 1)}
                  className="px-2.5 text-gray-400 hover:text-black font-semibold text-sm"
                >
                  +
                </button>
              </div>

              {/* Remove Action */}
              <button
                onClick={() => removeFromCart(item.product, item.size)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}
        </div>

        {/* Order Summary - Right */}
        <div className="bg-gray-50 border border-gray-100 p-6 self-start space-y-6">
          <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-gray-200 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Bag Subtotal</span>
              <span className="font-semibold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between text-gray-500">
              <span>Shipping cost</span>
              <span className="font-semibold text-black">
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            
            {shipping > 0 && (
              <p className="text-[10px] text-gray-400 italic">
                Add ₹{(1500 - subtotal).toLocaleString('en-IN')} more to unlock FREE shipping!
              </p>
            )}

            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-bold text-black">
              <span>Grand Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full btn-gold-accent flex items-center justify-center font-bold text-xs py-4 tracking-widest"
          >
            Proceed to Checkout <ArrowRight size={14} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
