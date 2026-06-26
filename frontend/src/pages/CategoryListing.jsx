import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw, X, Search } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const CategoryListing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [searchVal, setSearchVal] = useState('');
  
  // Mobile UI States
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || '');
    setSelectedSize(params.get('size') || '');
    setPriceMin(params.get('priceMin') || '');
    setPriceMax(params.get('priceMax') || '');
    setSearchVal(params.get('search') || '');
  }, [location.search]);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construct query string matching backend filters
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedSize) params.append('size', selectedSize);
        if (priceMin) params.append('priceMin', priceMin);
        if (priceMax) params.append('priceMax', priceMax);
        if (searchVal) params.append('search', searchVal);

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Slight debounce or regular fetch
    fetchProducts();
  }, [selectedCategory, selectedSize, priceMin, priceMax, searchVal]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams(location.search);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    navigate(`/shop?${params.toString()}`, { replace: true });
  };

  const handleCategoryChange = (slug) => {
    const val = selectedCategory === slug ? '' : slug;
    setSelectedCategory(val);
    updateURL({ category: val });
  };

  const handleSizeChange = (size) => {
    const val = selectedSize === size ? '' : size;
    setSelectedSize(val);
    updateURL({ size: val });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateURL({ priceMin, priceMax });
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateURL({ search: searchVal });
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setPriceMin('');
    setPriceMax('');
    setSearchVal('');
    navigate('/shop', { replace: true });
  };

  const availableSizes = ['S', 'M', 'L', 'XL', 'One Size'];

  // Banner Header title determination
  const categoryObject = categories.find((c) => c.slug === selectedCategory);
  const headerTitle = categoryObject ? `${categoryObject.name}'s Collection` : 'All Collections';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in font-sans">
      
      {/* Header Banner */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">Shop / Collections</span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase text-black mt-1 font-serif">{headerTitle}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center space-x-2 border border-black hover:border-gold hover:text-gold px-4 py-2.5 text-xs uppercase tracking-widest font-semibold md:hidden transition-all duration-200"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 border border-gray-200 hover:border-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all duration-200 text-gray-500 hover:text-black"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-4 border-r border-gray-100">
          
          {/* Search Filter */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">Search</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Product name..."
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full border border-gray-200 py-2.5 pl-3 pr-9 text-xs outline-none focus:border-gold"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <Search size={14} />
              </button>
            </form>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">Categories</h3>
            <div className="flex flex-col space-y-2 text-xs">
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.slug}
                    onChange={() => handleCategoryChange(cat.slug)}
                    className="mr-2.5 h-3.5 w-3.5 border-gray-300 accent-gold cursor-pointer"
                  />
                  <span className={selectedCategory === cat.slug ? 'font-semibold text-black' : 'text-gray-500 hover:text-black'}>
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes Filter */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">Size</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`border text-[10px] uppercase font-bold py-1.5 px-3 transition-colors ${
                    selectedSize === size
                      ? 'bg-black border-black text-white'
                      : 'border-gray-200 text-gray-500 hover:border-black hover:text-black bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">Price Range (₹)</h3>
            <form onSubmit={handlePriceApply} className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full border border-gray-200 p-2 text-xs outline-none focus:border-gold"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full border border-gray-200 p-2 text-xs outline-none focus:border-gold"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-gold hover:text-black transition-colors duration-200 text-[10px] font-bold uppercase tracking-widest py-2"
              >
                Apply Price
              </button>
            </form>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse border border-gray-100 rounded"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 border border-gray-100">
              <p className="text-sm text-gray-400 uppercase tracking-widest">No products found matching filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 btn-gold py-2.5 px-6 font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Drawer Slide-out Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>

          <div className="relative flex flex-col w-full max-w-xs bg-white shadow-2xl h-full py-4 px-6 z-10 overflow-y-auto animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
              <span className="text-xs uppercase tracking-widest font-bold">Filter By</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            {/* Content Filters (duplicate logic but responsive form) */}
            <div className="space-y-6">
              
              {/* Search */}
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Search</h3>
                <form onSubmit={(e) => { e.preventDefault(); setMobileFiltersOpen(false); }} className="relative">
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={searchVal}
                    onChange={handleSearchChange}
                    className="w-full border border-gray-200 py-2 pl-3 pr-8 text-xs outline-none"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={14} />
                  </button>
                </form>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Categories</h3>
                <div className="flex flex-col space-y-2 text-xs">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.slug}
                        onChange={() => handleCategoryChange(cat.slug)}
                        className="mr-2 h-3.5 w-3.5 accent-gold"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`border text-[10px] uppercase font-bold py-1.5 px-3 ${
                        selectedSize === size
                          ? 'bg-black border-black text-white'
                          : 'border-gray-200 text-gray-500 hover:border-black bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Price (₹)</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs outline-none"
                  />
                  <span className="text-gray-400 text-xs">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-gold py-3 text-xs tracking-widest mt-6"
              >
                Close & View Results
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryListing;
