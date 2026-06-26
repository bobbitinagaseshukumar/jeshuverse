import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, CheckSquare, Clock } from 'lucide-react';
import api from '../utils/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
      default:
        return 'bg-gold-pale text-gold-dark border-gold-light';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-20 bg-gray-100 rounded w-full mb-4"></div>
        <div className="h-20 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-full text-gray-300">
            <ShoppingBag size={48} />
          </div>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wide text-black">No Orders Found</h2>
        <p className="text-xs text-gray-400 mt-2">You haven't placed any orders yet on JeshuVerse.</p>
        <Link to="/shop" className="mt-6 inline-block btn-gold font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-8 font-serif">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-100 bg-white shadow-sm overflow-hidden">
            
            {/* Order Meta Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex flex-wrap gap-4 items-center justify-between text-xs text-gray-500">
              <div className="flex space-x-6">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Order Placed</span>
                  <span className="font-medium text-black flex items-center mt-1">
                    <Calendar size={13} className="mr-1 text-gray-400" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Total Amount</span>
                  <span className="font-semibold text-black mt-1 block">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Ship To</span>
                  <span className="font-medium text-black mt-1 block truncate max-w-[150px]" title={order.shippingAddress}>
                    {order.shippingAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-gray-400 uppercase font-mono font-bold select-all">Ref: {order._id}</span>
                <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold border rounded ${getStatusBadgeClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={`${item.product}-${item.size}`} className="py-4 flex gap-4 first:pt-0 last:pb-0 items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-black leading-tight line-clamp-1">{item.name}</h4>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                        Size: <span className="text-black">{item.size}</span> • Qty: <span className="text-black">{item.qty}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-black">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Delivery/Delivered Details Footer */}
            {order.orderStatus === 'Delivered' && order.deliveredAt && (
              <div className="bg-green-50 border-t border-gray-100 px-6 py-3 flex items-center text-[10px] text-green-700 font-sans font-semibold">
                <CheckSquare size={13} className="mr-1.5" />
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </div>
            )}
            {order.orderStatus !== 'Delivered' && (
              <div className="bg-gold-pale/30 border-t border-gray-100 px-6 py-3 flex items-center text-[10px] text-gold-dark font-sans font-semibold">
                <Clock size={13} className="mr-1.5" />
                Under processing - Expected dispatch shortly
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
