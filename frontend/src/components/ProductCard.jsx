import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const isWishlisted = isInWishlist(product._id);

  // Fallback category name if populated as object
  const categoryName = product.category?.name || 'Fashion';

  return (
    <div className="group relative bg-white border border-gray-100 overflow-hidden card-shadow card-hover">
      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
        aria-label="Add to wishlist"
      >
        <Heart
          size={18}
          className={`transition-colors duration-300 ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-black'
          }`}
        />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-gray-50 aspect-[3/4]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600'}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-semibold">
          {categoryName}
        </p>
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-medium text-black line-clamp-1 hover:text-gold transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Price */}
        <div className="mt-2 flex items-center justify-between">
          <RatingStars value={product.rating} text={product.numReviews} size={13} />
          <span className="text-sm font-semibold text-black">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
