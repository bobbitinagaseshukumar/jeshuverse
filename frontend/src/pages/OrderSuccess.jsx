import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center font-sans animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-gold-pale border border-gold-light rounded-full text-gold">
          <CheckCircle size={56} className="fill-current text-white stroke-gold" />
        </div>
      </div>

      <h1 className="text-2xl font-bold uppercase tracking-wider text-black font-serif">Order Confirmed</h1>
      <p className="text-xs text-gray-500 mt-2">
        Thank you for shopping at JeshuVerse! Your payment was successful, and we have received your order details.
      </p>

      {orderId && (
        <div className="my-8 p-4 bg-gray-50 border border-gray-100 rounded text-left">
          <span className="block text-[10px] uppercase font-bold text-gray-400">Order Reference</span>
          <span className="text-xs font-mono font-bold text-black break-all select-all">{orderId}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 font-sans mt-8">
        <Link
          to="/orders"
          className="btn-gold flex items-center justify-center font-bold text-xs"
        >
          <ShoppingBag size={14} className="mr-2" /> Track My Orders
        </Link>
        <Link
          to="/shop"
          className="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black mt-2 inline-flex items-center justify-center hover:translate-x-0.5 transition-transform"
        >
          Continue Shopping <ArrowRight size={12} className="ml-1.5" />
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccess;
