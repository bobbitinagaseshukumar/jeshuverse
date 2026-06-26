import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageSquare, Phone, Share2, ShoppingBag, Star, ShieldAlert, Check } from 'lucide-react';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/slug/${slug}`);
        setProduct(data);
        setActiveImage(data.images[0] || '');
        // Select first size by default if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        // Fetch related products in the same category
        const relRes = await api.get(`/products?category=${data.category._id}`);
        const filtered = relRes.data.products.filter((p) => p._id !== data._id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-pulse">
        <div className="h-96 bg-gray-100 rounded w-full mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <h2 className="text-xl font-bold text-black">Product not found.</h2>
        <Link to="/shop" className="mt-4 inline-block btn-gold">Back to Shop</Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const whatsappNum = import.meta.env.VITE_WHATSAPP_NUMBER || '+919999999999';
    const cleanPhone = whatsappNum.replace(/[^0-9]/g, '');

    const message = `Hello JeshuVerse,
I want to order:

Product: ${product.name}
Size: ${selectedSize}
Price: ₹${product.price}

My Name:
My Address:`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, '_blank');
  };

  const handleCall = () => {
    const phoneNum = import.meta.env.VITE_CONTACT_PHONE || '+919999999999';
    window.open(`tel:${phoneNum}`, '_self');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setComment('');
      // Reload product details to show new review
      const { data } = await api.get(`/products/slug/${slug}`);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Product Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="overflow-hidden bg-gray-50 border border-gray-100 aspect-[3/4]">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 aspect-[3/4] overflow-hidden border bg-gray-50 shrink-0 ${
                    activeImage === img ? 'border-gold border-2' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details Panel */}
        <div className="flex flex-col space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                {product.category?.name}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 border border-gray-200 hover:border-black text-gray-400 hover:text-black rounded-full transition-colors relative"
                  aria-label="Share"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                  {copied && (
                    <span className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] py-1 px-2 uppercase tracking-wider rounded shrink-0">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 border border-gray-200 hover:border-black text-gray-400 hover:text-black rounded-full transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black mt-2 font-serif">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center space-x-4">
              <RatingStars value={product.rating} text={product.numReviews} size={15} />
              <span className="h-4 w-px bg-gray-200"></span>
              <span className={`text-[10px] uppercase font-bold tracking-widest ${
                isOutOfStock ? 'text-red-500' : 'text-green-600'
              }`}>
                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-y border-gray-100 py-4 flex items-baseline">
            <span className="text-3xl font-bold text-black">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-2">Description</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border text-xs uppercase font-bold py-2.5 px-4 transition-colors ${
                      selectedSize === size
                        ? 'bg-black border-black text-white'
                        : 'border-gray-200 text-gray-600 hover:border-black bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-2">Quantity</h3>
              <div className="flex items-center space-x-3 w-32 border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-400 hover:text-black font-semibold text-lg"
                >
                  -
                </button>
                <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-400 hover:text-black font-semibold text-lg"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            {isOutOfStock ? (
              <button disabled className="w-full bg-gray-200 text-gray-400 font-bold uppercase tracking-widest py-4 text-xs cursor-not-allowed">
                Out Of Stock
              </button>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="btn-gold-outline w-full py-4 text-xs tracking-widest flex items-center justify-center font-bold"
                  >
                    <ShoppingBag size={14} className="mr-2" /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="btn-gold-accent w-full py-4 text-xs tracking-widest flex items-center justify-center font-bold"
                  >
                    Buy Now
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="bg-green-600 text-white hover:bg-green-700 transition-colors w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center"
                  >
                    <MessageSquare size={14} className="mr-2" /> WhatsApp Order
                  </button>
                  <button
                    onClick={handleCall}
                    className="bg-zinc-800 hover:bg-black text-white transition-colors w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center"
                  >
                    <Phone size={14} className="mr-2" /> Call Now
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Reviews and Ratings Section */}
      <section className="border-t border-gray-100 pt-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold tracking-wider text-black uppercase font-serif">Customer Reviews</h2>
            {product.reviews.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 p-6 text-center text-xs text-gray-400">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-black">{rev.name}</h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1">
                      <RatingStars value={rev.rating} size={12} />
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed mt-2">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div>
            <h2 className="text-lg font-bold tracking-wider text-black uppercase font-serif mb-4">Write a Review</h2>
            {userInfo ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewSuccess && (
                  <div className="bg-green-50 text-green-600 text-xs p-3 rounded font-semibold border border-green-100">
                    Thank you! Review submitted successfully.
                  </div>
                )}
                {reviewError && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded font-semibold border border-red-100">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                  >
                    <option value="5">5 ★ Excellent</option>
                    <option value="4">4 ★ Very Good</option>
                    <option value="3">3 ★ Average</option>
                    <option value="2">2 ★ Poor</option>
                    <option value="1">1 ★ Terrible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Comment</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                    placeholder="Your detailed feedback..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full btn-gold py-3 text-xs tracking-widest font-bold"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 border border-gray-100 p-6 text-center rounded">
                <p className="text-xs text-gray-400 mb-3">Please login to write reviews.</p>
                <Link to="/login" className="btn-gold py-2 px-4 text-xs font-semibold">Login Now</Link>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related Products Panel */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 pt-16">
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black">Related Products</h2>
            <div className="h-0.5 w-12 bg-gold mx-auto mt-3"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetail;
