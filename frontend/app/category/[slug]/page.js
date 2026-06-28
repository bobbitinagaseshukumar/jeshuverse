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
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  

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

  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort) {
      setSortOption(sort);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        // First get the category to find its ID
        if (slug === 'all') { setSubCategories([]); return; }
        const catRes = await axios.get(`${API_URL}/categories`);
        const cats = catRes.data;
        // Match slug to category
        const matchedCat = cats.find(c => c.slug === slug || c.name === categoryName);
        if (matchedCat) {
          const subRes = await axios.get(`${API_URL}/subcategories?categoryId=${matchedCat._id || matchedCat.id}`);
          setSubCategories(subRes.data);
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    };
    fetchSubCategories();
  }, [slug, categoryName]);

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
      if (selectedSubCategory) params.subCategory = selectedSubCategory;

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
  }, [slug, sortOption, selectedSize, selectedColor, selectedSubCategory]); // Re-fetch on filter change

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
    setSelectedSubCategory('');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-5 mb-8 gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white capitalize">
            {categoryName === 'All' ? 'All Collections' : categoryName}
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1.5">
            {loading ? 'Searching styles...' : `${products.length} stunning styles found`}
          </p>
        </div>

        {/* Sort and mobile filter button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm font-semibold text-gray-200 hover:border-primary lg:hidden shadow-lg shadow-black/20 transition-colors"
          >
            <FiSliders size={16} />
            <span>Filters</span>
          </button>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm font-semibold text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary shadow-lg shadow-black/20 cursor-pointer"
          >
            <option value="latest">Sort: Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedSubCategory('')}
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
              selectedSubCategory === ''
                ? 'border-primary bg-primary text-white shadow-lg shadow-black/20'
                : 'border-white/10 text-gray-200 bg-[#111] hover:border-white/15'
            }`}
          >
            All
          </button>
          {subCategories.map((sc) => (
            <button
              key={sc._id || sc.id}
              onClick={() => setSelectedSubCategory(sc.name)}
              className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
                selectedSubCategory === sc.name
                  ? 'border-primary bg-primary text-white shadow-lg shadow-black/20'
                  : 'border-white/10 text-gray-200 bg-[#111] hover:border-white/15'
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      )}

      {/* Main page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Filters Sidebar (Desktop) */}
        <div className="hidden lg:block space-y-6 bg-[#111] p-6 rounded-3xl border border-white/10 shadow-lg shadow-black/20 h-fit">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <h3 className="font-display font-extrabold text-white text-base">Filter Panel</h3>
            <button onClick={handleClearFilters} className="text-xs text-amber-400 font-bold hover:underline">
              Clear All
            </button>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Price Range</span>
            <form onSubmit={handleApplyPriceFilter} className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-500"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-500"
              />
              <button type="submit" className="px-3 py-2 bg-primary hover:bg-primary-light text-white text-xs font-bold rounded-xl shadow">
                Go
              </button>
            </form>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Filter by Size</span>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                    selectedSize === sz
                      ? 'border-primary bg-primary text-white'
                      : 'border-white/10 text-gray-200 bg-[#111] hover:border-white/15'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Filter by Color</span>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all ${
                    selectedColor === col
                      ? 'border-primary bg-[#111] text-white'
                      : 'border-white/10 text-gray-200 bg-[#111] hover:border-white/15'
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
                <div key={n} className="bg-white/8 rounded-2xl h-80 animate-pulse-slow" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#111] border border-white/10 rounded-3xl p-8 max-w-lg mx-auto">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-display font-extrabold text-lg text-white">No styles matched your search</h3>
              <p className="text-xs text-gray-500 leading-relaxed mt-2.5">
                Try loosening your filters, adjusting the price sliders, or browsing another Category department.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 px-6 py-2 bg-white/10 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl shadow transition-colors"
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-[#111] h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-white">
                  <FiFilter size={18} />
                  <h3 className="font-display font-extrabold text-base">Filter Styles</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-purple-50 hover:text-gray-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Price Range</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Filter by Size</span>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                      className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                        selectedSize === sz
                          ? 'border-primary bg-primary text-white'
                          : 'border-white/10 text-gray-200 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Filter by Color</span>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                      className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                        selectedColor === col
                          ? 'border-primary bg-[#111] text-white'
                          : 'border-white/10 text-gray-200 bg-white'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10 mt-6">
              <button
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="py-2.5 bg-purple-50 text-gray-200 text-xs font-bold rounded-xl"
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
