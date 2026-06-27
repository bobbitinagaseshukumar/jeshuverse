'use client';
import { API_URL } from '../../../utils/api';


import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import ProductCard from '../../../components/ProductCard';
import { FiHeart, FiShoppingCart, FiPhoneCall, FiChevronRight, FiCheck, FiSend, FiStar, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaCreditCard } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selector States
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // WhatsApp Checkout Modal States
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappName, setWhatsappName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappAddress, setWhatsappAddress] = useState('');
  const [whatsappSettings, setWhatsappSettings] = useState({ whatsappNumber: '919876543210' });

  // Zoom Effect States
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const zoomImageRef = useRef(null);

  

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch Product Details
        const prodResponse = await axios.get(`${API_URL}/products/${id}`);
        const prodData = prodResponse.data;
        setProduct(prodData);
        setSelectedImage(prodData.images[0]);
        if (prodData.sizes && prodData.sizes.length > 0) setSelectedSize(prodData.sizes[0]);
        if (prodData.colors && prodData.colors.length > 0) {
          const firstColor = prodData.colors[0];
          setSelectedColor(typeof firstColor === 'string' ? firstColor : firstColor.name);
        }

        // Fetch Related Products
        const relResponse = await axios.get(`${API_URL}/products/related/${encodeURIComponent(prodData.category)}?exclude=${id}`);
        setRelatedProducts(relResponse.data);

        // Fetch Product Reviews
        const revResponse = await axios.get(`${API_URL}/reviews/${id}`);
        setReviews(revResponse.data);

        // Fetch Store Public Settings (WhatsApp settings)
        const settingsResponse = await axios.get(`${API_URL}/admin/settings/public`);
        setWhatsappSettings(settingsResponse.data);

      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, API_URL]);

  // Load user data into WhatsApp checkout form when modal opens
  useEffect(() => {
    if (user && whatsappModalOpen) {
      setWhatsappName(user.name || '');
      setWhatsappPhone(user.phone || '');
      if (user.address) {
        if (typeof user.address === 'string') {
          try {
            const parsed = JSON.parse(user.address);
            if (parsed && typeof parsed === 'object') {
              const addr = `${parsed.street || ''}, ${parsed.city || ''}, ${parsed.state || ''} - ${parsed.zipCode || ''}`;
              setWhatsappAddress(addr.replace(/^,\s*|,\s*$/g, '').replace(/^[,\s-]+|[,\s-]+$/g, ''));
            } else {
              setWhatsappAddress(user.address);
            }
          } catch (e) {
            setWhatsappAddress(user.address);
          }
        } else if (typeof user.address === 'object') {
          const addr = `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} - ${user.address.zipCode || ''}`;
          setWhatsappAddress(addr.replace(/^,\s*|,\s*$/g, '').replace(/^[,\s-]+|[,\s-]+$/g, ''));
        }
      }
    }
  }, [user, whatsappModalOpen]);

  // Image Zoom Mouse Interactions
  const handleMouseMove = (e) => {
    const { left, top, width, height } = zoomImageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${selectedImage})`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  // Add review submission handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in to submit a review.');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/products/${id}/reviews`, {
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews([response.data.review, ...reviews]);
      setComment('');
      setReviewSuccess('Review posted successfully!');
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  // Trigger WhatsApp order redirection
  const handleWhatsappSend = async () => {
    if (!whatsappAddress || !whatsappAddress.trim()) {
      alert('Please enter your delivery address to proceed.');
      return;
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const totalItemPrice = price * quantity;
    const cleanPhone = whatsappSettings.whatsappNumber.replace(/\D/g, ''); // Ensure no plus sign or spaces

    // Log the order inquiry to the database
    try {
      await axios.post(`${API_URL}/orders/whatsapp`, {
        productId: product._id,
        name: product.name,
        qty: quantity,
        image: product.images[0],
        price,
        size: selectedSize || 'N/A',
        color: selectedColor || 'N/A',
        shippingAddress: whatsappAddress,
        userPhone: user ? user.mobile : ''
      });
    } catch (err) {
      console.error('Error logging WhatsApp order inquiry in database:', err);
    }

    const whatsappMessage = `Hello JeshuVerse,
I want to order:

Product Name: ${product.name}
Size: ${selectedSize || 'N/A'}
Color: ${selectedColor || 'N/A'}
Quantity: ${quantity}
Price: ₹${totalItemPrice.toLocaleString('en-IN')}
Product Image: ${product.images[0]}

Delivery Address: ${whatsappAddress}

Please confirm my order.`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    setWhatsappModalOpen(false);
  };

  // Trigger Buy Now (redirects to Checkout with this product in local states)
  const handleBuyNow = () => {
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const orderData = {
      product: product._id,
      name: product.name,
      image: product.images[0],
      price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      stockQuantity: product.stockQuantity
    };
    
    // Save immediate purchase item to sessionStorage
    sessionStorage.setItem('jv_buy_now', JSON.stringify(orderData));
    router.push('/checkout?buyNow=true');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-purple-950">Product not found</h2>
        <button onClick={() => router.push('/')} className="mt-4 px-6 py-2 bg-primary text-white rounded-full">
          Go Home
        </button>
      </div>
    );
  }

  const isProductStarred = isInWishlist(product._id);
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const isDiscounted = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-6">
        <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/')}>Home</span>
        <FiChevronRight />
        <span className="hover:text-primary cursor-pointer" onClick={() => router.push(`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}>{product.category}</span>
        <FiChevronRight />
        <span className="text-purple-900 truncate max-w-[150px]">{product.name}</span>
      </nav>

      {/* Main product display columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Col: Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            
            {/* Thumbnails list */}
            <div className="col-span-2 space-y-3">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === imgUrl ? 'border-primary shadow-sm' : 'border-purple-100/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Main Interactive Zoom Box */}
            <div className="col-span-10 relative aspect-[4/5] bg-purple-50/20 border border-purple-100 rounded-3xl overflow-hidden">
              <div 
                className="w-full h-full relative cursor-zoom-in"
                ref={zoomImageRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain md:object-cover object-top" 
                />
              </div>

              {/* Magnified Hover Window overlay (Zoom) */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl z-10 border border-purple-100/50 bg-no-repeat"
                style={{
                  ...zoomStyle,
                  backgroundSize: '250%' // Zoom factor
                }}
              />

              {/* Badge */}
              {isDiscounted && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Right Col: Details information */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div>
            <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">
              {product.category}
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-purple-400 mt-2">SKU: <span className="font-mono font-semibold">{product.sku}</span></p>
          </div>

          {/* Pricing Box */}
          <div className="p-4.5 bg-purple-50/50 rounded-2xl border border-purple-100">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-extrabold text-2xl sm:text-3xl text-primary">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {isDiscounted && (
                <>
                  <span className="text-sm text-purple-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-purple-400 mt-1.5">*Inclusive of all taxes. Free shipping on orders over ₹499.</p>
          </div>

          {/* Jewellery Specifications */}
          {product.category?.toLowerCase() === 'jewellery' && (product.grams || product.cost) && (
            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/50 space-y-2.5">
              <span className="text-amber-800 text-[10px] font-extrabold uppercase tracking-wider block">✨ Jewellery Specifications</span>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-purple-950">
                {product.grams && (
                  <div className="bg-white/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-purple-400 text-[9px] block uppercase tracking-wide">Weight</span>
                    <span className="text-amber-900 font-bold text-sm">{product.grams}</span>
                  </div>
                )}
                {product.cost && (
                  <div className="bg-white/60 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-purple-400 text-[9px] block uppercase tracking-wide">Making Cost</span>
                    <span className="text-amber-900 font-bold text-sm">₹{Number(product.cost).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specs: Sizes selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-purple-950 uppercase tracking-wider">Select Size</span>
                <span className="text-primary hover:underline cursor-pointer">Size Chart</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${
                      selectedSize === sz
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-purple-200 text-purple-900 bg-white hover:border-purple-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specs: Colors selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <span className="text-purple-950 text-xs font-bold uppercase tracking-wider block">Select Color</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((col, idx) => {
                  // Support both old format (string) and new format ({name, image})
                  const colorName = typeof col === 'string' ? col : col.name;
                  const colorImage = typeof col === 'object' && col.image ? col.image : null;
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={colorName}
                      onClick={() => {
                        setSelectedColor(colorName);
                        if (colorImage) {
                          setSelectedImage(colorImage);
                        } else if (product.images && product.images[idx]) {
                          setSelectedImage(product.images[idx]);
                        }
                      }}
                      className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-primary bg-purple-900 text-white shadow-sm'
                          : 'border-purple-200 text-purple-900 bg-white hover:border-purple-400'
                      }`}
                    >
                      {colorImage && (
                        <img src={colorImage} alt={colorName} className="w-6 h-8 object-cover rounded-md border border-purple-100" />
                      )}
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <span className="text-purple-950 text-xs font-bold uppercase tracking-wider block">Quantity</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-purple-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 hover:bg-purple-50 text-purple-950 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-purple-950">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stockQuantity, prev + 1))}
                  className="px-3.5 py-2 hover:bg-purple-50 text-purple-950 font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-purple-400">
                {product.stockQuantity > 0 
                  ? `${product.stockQuantity} items left in stock` 
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4 border-t border-purple-100">
            {product.stockQuantity > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                  className="flex items-center justify-center gap-2 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-300 text-primary font-bold rounded-2xl shadow-sm transition-all"
                >
                  <FiShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-2xl shadow-md transition-all"
                >
                  <FaCreditCard size={16} />
                  <span>Buy Now</span>
                </button>
              </div>
            ) : (
              <div className="w-full text-center bg-red-50 border border-red-200 text-red-600 font-bold py-3.5 rounded-2xl">
                Product Currently Out Of Stock
              </div>
            )}

            {/* WhatsApp Order Button & Wishlist buttons */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setWhatsappModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition-all"
              >
                <FaWhatsapp size={20} />
                <span>Order via WhatsApp</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`px-4 py-3 rounded-2xl border transition-all ${
                  isProductStarred
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-purple-200 text-purple-900 hover:border-purple-300'
                }`}
              >
                <FiHeart size={20} className={isProductStarred ? 'fill-red-500' : ''} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-purple-100">
            <h3 className="font-display font-extrabold text-sm text-purple-950 uppercase tracking-wider mb-2">
              Product Description
            </h3>
            <p className="text-purple-900 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

        </div>
      </div>

      {/* Review list and submit review sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-16 pt-12 border-t border-purple-100">
        
        {/* Left: Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-purple-950">
            Customer Reviews ({reviews.length})
          </h2>
          
          {reviews.length === 0 ? (
            <p className="text-purple-400 text-sm italic bg-purple-50/50 p-6 rounded-2xl border border-purple-100/30">
              No reviews yet. Be the first to leave a review!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-bold text-sm text-purple-950">{rev.userName}</span>
                    <span className="text-[10px] text-purple-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <FiStar 
                        key={idx} 
                        className={`w-3.5 h-3.5 ${idx < rev.rating ? 'text-gold fill-gold' : 'text-purple-100'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-purple-950 leading-relaxed font-medium">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Submit Review Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm h-fit">
          <h3 className="font-display font-extrabold text-lg text-purple-950 mb-4">
            Write a Review
          </h3>
          
          {token ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                  {reviewSuccess}
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-purple-950 block mb-1.5 uppercase">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <FiStar 
                        size={22} 
                        className={star <= rating ? 'text-gold fill-gold' : 'text-purple-200'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-950 block mb-1.5 uppercase">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience styling this clothing/jewellery..."
                  className="w-full p-3 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-400 text-purple-950"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <FiSend size={14} /> Submit Review
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-purple-400 font-semibold mb-4">Please log in to submit product feedback.</p>
              <button 
                onClick={() => router.push('/login')} 
                className="px-5 py-2 bg-purple-55 bg-primary text-white font-bold text-xs rounded-xl shadow"
              >
                Log In
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Related Products Shelf */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-purple-100">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-purple-950 mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp Ordering Dialog Modal Overlay */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          
          {/* Backdrop */}
          <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm" onClick={() => setWhatsappModalOpen(false)} />

          {/* Dialog Container */}
          <div className="bg-white rounded-3xl border border-purple-100 shadow-2xl relative w-full max-w-md p-6 sm:p-8 z-10 animate-float-slow">
            <button
              onClick={() => setWhatsappModalOpen(false)}
              className="absolute top-4 right-4 text-purple-400 hover:text-purple-950 p-1 rounded-full hover:bg-purple-50 transition-colors"
            >
              <FiX size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <FaWhatsapp size={26} />
              <h3 className="font-display font-extrabold text-lg sm:text-xl text-purple-950">
                WhatsApp Checkout
              </h3>
            </div>

            <p className="text-xs text-purple-400 leading-relaxed mb-6 font-semibold">
              Fill in your checkout details below. We will generate the formatted order request and open WhatsApp directly.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Shipping Address</label>
                <textarea
                  required
                  rows={4}
                  value={whatsappAddress}
                  onChange={(e) => setWhatsappAddress(e.target.value)}
                  placeholder="Enter your delivery address: House No, Street, Landmark, City, State - Zip Code"
                  className="w-full pl-3 pr-3 py-3.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm text-purple-950 placeholder-purple-300 font-semibold"
                />
              </div>

              <button
                onClick={handleWhatsappSend}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md mt-6 transition-colors"
              >
                <FaWhatsapp size={20} />
                <span>Submit and open WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
