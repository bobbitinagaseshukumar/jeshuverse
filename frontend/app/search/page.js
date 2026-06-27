'use client';
import { API_URL } from '../../utils/api';


import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import { FiSearch, FiSliders } from 'react-icons/fi';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [recommendations, setRecommendations] = useState([]);

  

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/products?search=${encodeURIComponent(query)}`);
        setProducts(response.data);
        
        // Load featured items as recommendations
        const recResponse = await axios.get(`${API_URL}/products?featured=true`);
        setRecommendations(recResponse.data.slice(0, 4));
      } catch (error) {
        console.error('Error loading search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    setSearchInput(query);
  }, [query, API_URL]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Search Input Banner */}
      <div className="bg-purple-900 rounded-3xl p-6 sm:p-10 text-white mb-10 border-b-4 border-gold shadow-md">
        <h1 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-center mb-4.5">
          Find Your Perfect Style
        </h1>
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search sarees, kurtas, choker jewellery..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-5 pr-12 py-3 rounded-full bg-white text-purple-950 font-medium placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-gold border-none shadow-lg text-sm"
          />
          <button type="submit" className="absolute right-4 top-3.5 text-purple-900 hover:text-primary">
            <FiSearch size={20} />
          </button>
        </form>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-purple-950">
          Search Results for: <span className="text-primary font-extrabold">"{query}"</span>
        </h2>
        <p className="text-xs text-purple-400 mt-1">
          {loading ? 'Searching...' : `${products.length} products found`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse-slow">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-purple-100/50 rounded-2xl h-80" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border border-purple-100 rounded-3xl p-8 max-w-lg mx-auto">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-display font-extrabold text-lg text-purple-950">No results found</h3>
          <p className="text-xs text-purple-400 leading-relaxed mt-2.5">
            We couldn't find any clothing or jewellery matching "{query}". Double-check spelling or try search terms like "Saree", "Nehru", "Kundan" or "Choker".
          </p>
          <button
            onClick={() => router.push('/category/all')}
            className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Browse All Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}

      {/* Recommended items under search results */}
      {recommendations.length > 0 && (
        <div className="mt-16 pt-12 border-t border-purple-100">
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-purple-950 mb-6">
            Trending Collections Recommended For You
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
