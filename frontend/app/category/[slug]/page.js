'use client';
import { API_URL } from '../../../utils/api';


import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import ProductCard from '../../../components/ProductCard';
import { FiFilter, FiSliders, FiX, FiCheck } from 'react-icons/fi';

function CategoryContent() {
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  

  // Mapping slug to DB Categories name
  const slugToCategoryName = (categorySlug) => {
    switch (categorySlug) {
      case 'women-wear': return "Women's Wear";
      case 'men-wear': return "Men's Wear";
      case 'kids-wear': return "Kids Wear";
      case 'jewellery': return "Jewellery";
      case 'all':
      default: return 'All';
    }
  };

  const categoryName = slugToCategoryName(slug);

  // Fetching products based on Category, Filters, and Sorting
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: categoryName,
        sort: sortOption
      };

      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedSize) params.size = selectedSize;
      if (selectedColor) params.color = selectedColor;

      const response = await axios.get(`${API_URL}/products`, { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [slug, sortOption, selectedSize, selectedColor]); // Re-fetch on filter change

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setSortOption('latest');
    // We cannot immediately state-update and fetch because state updates are async.
    // Triggering direct fetch with blank params.
    setTimeout(fetchProducts, 0);
  };

  // Spec Lists
  const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Adjustable'];
  const colors = ['Gold', 'White', 'Black', 'Red', 'Blue', 'Pink', 'Green', 'Silver', 'Ivory White'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Category Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-100 pb-5 mb-8 gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-purple-950 capitalize">
            {categoryName === 'All' ? 'All Collections' : categoryName}
          </h1>
          <p className="text-xs text-purple-400 font-semibold mt-1.5">
            {loading ? 'Searching styles...' : `${products.length} stunning styles found`}
          </p>
        </div>

        {/* Sort and mobile filter button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white border border-purple-100 rounded-xl text-sm font-semibold text-purple-900 hover:border-primary lg:hidden shadow-sm transition-colors"
          >
            <FiSliders size={16} />
            <span>Filters</span>
          </button>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-purple-100 rounded-xl text-sm font-semibold text-purple-900 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
          >
            <option value="latest">Sort: Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Filters Sidebar (Desktop) */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm h-fit">
          <div className="flex justify-between items-center pb-3 border-b border-purple-50">
            <h3 className="font-display font-extrabold text-purple-950 text-base">Filter Panel</h3>
            <button onClick={handleClearFilters} className="text-xs text-amber-600 font-bold hover:underline">
              Clear All
            </button>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Price Range</span>
            <form onSubmit={handleApplyPriceFilter} className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-purple-950 focus:outline-none focus:ring-1 focus:ring-primary placeholder-purple-300"
              />
              <span className="text-purple-300 text-xs">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-purple-950 focus:outline-none focus:ring-1 focus:ring-primary placeholder-purple-300"
              />
              <button type="submit" className="px-3 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow">
                Go
              </button>
            </form>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 pt-4 border-t border-purple-50">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Filter by Size</span>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                    selectedSize === sz
                      ? 'border-primary bg-primary text-white'
                      : 'border-purple-100 text-purple-900 bg-white hover:border-purple-300'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3 pt-4 border-t border-purple-50">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Filter by Color</span>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                    selectedColor === col
                      ? 'border-primary bg-purple-900 text-white'
                      : 'border-purple-100 text-purple-900 bg-white hover:border-purple-300'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-purple-100/50 rounded-2xl h-80 animate-pulse-slow" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-purple-100 rounded-3xl p-8 max-w-lg mx-auto">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-display font-extrabold text-lg text-purple-950">No styles matched your search</h3>
              <p className="text-xs text-purple-400 leading-relaxed mt-2.5">
                Try loosening your filters, adjusting the price sliders, or browsing another Category department.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2 bg-purple-100 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile filter slide-out drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                <div className="flex items-center gap-1.5 text-purple-950">
                  <FiFilter size={18} />
                  <h3 className="font-display font-extrabold text-base">Filter Styles</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-purple-400 hover:bg-purple-50 hover:text-purple-900"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Price Range</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-sm text-purple-950"
                  />
                  <span className="text-purple-300">-</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl text-sm text-purple-950"
                  />
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-3 pt-4 border-t border-purple-50">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Filter by Size</span>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                      className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                        selectedSize === sz
                          ? 'border-primary bg-primary text-white'
                          : 'border-purple-100 text-purple-900 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-3 pt-4 border-t border-purple-50">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">Filter by Color</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                      className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                        selectedColor === col
                          ? 'border-primary bg-purple-900 text-white'
                          : 'border-purple-100 text-purple-900 bg-white'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-purple-100 mt-6">
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="py-2.5 bg-purple-50 text-purple-900 text-xs font-bold rounded-xl"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  fetchProducts();
                  setMobileFilterOpen(false);
                }}
                className="py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
