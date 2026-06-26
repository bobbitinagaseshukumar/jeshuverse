import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data.products);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products for sections
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice().reverse().slice(0, 4);
  const featured = products.slice(0, 3);

  return (
    <div className="animate-fade-in font-sans">
      {/* Hero Banner */}
      <section className="relative bg-zinc-950 text-white min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600"
            alt="Premium Fashion Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-1"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="max-w-xl space-y-6">
            <span className="flex items-center text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              <Sparkles size={14} className="mr-2" /> Elegant Fashion Store
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-serif">
              Elevate Your <br />
              <span className="italic font-light text-gold font-serif">Style Statement</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              Discover curated looks, comfortable fabrics, and luxury statement jewellery designed to enrich your premium fashion wardrobe.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-gold-accent text-center font-semibold">
                Explore Shop
              </Link>
              <Link to="/shop?category=jewellery" className="btn-gold-outline text-center text-white border-white hover:bg-white hover:text-black font-semibold">
                View Jewellery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons Section */}
      <section className="bg-gray-50 border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <Truck className="text-gold mb-3" size={28} />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-black">Express Delivery</h4>
              <p className="text-xs text-gray-400 mt-1">Fast delivery across all major Indian cities</p>
            </div>
            <div className="flex flex-col items-center p-4 border-y sm:border-y-0 sm:border-x border-gray-200">
              <ShieldCheck className="text-gold mb-3" size={28} />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-black">Razorpay Secure</h4>
              <p className="text-xs text-gray-400 mt-1">100% encrypted safe online payments</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <TrendingUp className="text-gold mb-3" size={28} />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-black">Premium Quality</h4>
              <p className="text-xs text-gray-400 mt-1">Ethically sourced premium cotton & jewelry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black uppercase">Browse Categories</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto mt-3"></div>
          <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider font-medium">Curated collections for every occasion</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse border border-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-65"></div>
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <h3 className="text-sm font-semibold tracking-wider text-white uppercase sm:text-base">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center text-[10px] uppercase text-gold tracking-widest mt-1 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    Shop Now <ArrowRight size={10} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black uppercase tracking-tight">New Arrivals</h2>
              <div className="h-0.5 w-12 bg-gold mt-3"></div>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-widest text-black hover:text-gold transition-colors duration-200"
            >
              See All Products
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded border border-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black uppercase">Best Sellers</h2>
          <div className="h-0.5 w-16 bg-gold mx-auto mt-3"></div>
          <p className="text-xs text-gray-400 mt-3 uppercase tracking-wider font-medium">Most loved items of the season</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded border border-gray-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Premium Highlight Grid */}
      <section className="bg-black text-white py-16 grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="aspect-square max-h-[500px] overflow-hidden bg-gray-950 order-2 md:order-1">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
            alt="Sparkling Jewelry Detail"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-8 sm:p-16 space-y-6 order-1 md:order-2">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Exquisite Collection</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">Timeless Jewellery Sets</h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
            Indulge in premium quality gold plated sets, zirconia inserts, and artisan crafted rings. Discover necklaces, bracelets, and rings perfect for formal gatherings or modern daily luxury.
          </p>
          <div className="pt-2">
            <Link to="/shop?category=jewellery" className="btn-gold-accent text-center text-xs font-semibold">
              Shop Jewelry
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gold-pale border-t border-gray-100 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-black uppercase font-serif">Join the JeshuVerse VIP</h2>
          <p className="text-xs text-gray-500 mt-2 font-sans">
            Subscribe to our exclusive styling tips, product drops, and flash sales notifications.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto font-sans" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm outline-none focus:border-gold"
              required
            />
            <button type="submit" className="btn-gold px-6">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
