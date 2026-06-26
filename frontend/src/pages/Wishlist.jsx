import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlistItems } = useContext(WishlistContext);

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-full text-red-300">
            <Heart size={48} className="fill-current text-white stroke-red-300" />
          </div>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wide text-black">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-400 mt-2">Browse the shop collections and save your favorite items here.</p>
        <Link to="/shop" className="mt-6 inline-block btn-gold font-bold">
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans animate-fade-in">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-8 font-serif">My Wishlist</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
