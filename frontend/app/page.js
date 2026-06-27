'use client';
import { API_URL } from '../utils/api';


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiPhoneCall } from 'react-icons/fi';
import NextLink from 'next/link';
// Parallax Showcase Component
function ParallaxShowcase() {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setOffsetY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Translate background slightly slower relative to scroll
  const translateY = (offsetY * 0.12) % 180;

  return (
    <section className="parallax-section relative w-full overflow-hidden border-y border-purple-900/10 max-w-7xl mx-auto my-6 sm:rounded-3xl shadow-xl">
      <div 
        className="parallax-bg" 
        style={{ 
          transform: `translateY(${translateY}px) scale(1.05)`,
          backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1500&q=80')" 
        }} 
      />
      <div className="absolute inset-0 bg-purple-950/80 flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none">
        <span className="text-gold font-extrabold text-[10px] sm:text-xs tracking-widest uppercase mb-3 block animate-pulse">
          JESHUVERSE LUXURY STUDIO
        </span>
        <h3 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight max-w-3xl">
          Where Heritage Weaves Meet Contemporary Style
        </h3>
        <p className="mt-4 text-purple-200 text-xs sm:text-base max-w-xl font-medium leading-relaxed">
          Sourced from traditional artisans, our designer sarees, ethnic wear, and luxury sets are crafted to celebrate you.
        </p>
        <div className="w-12 h-1 bg-gold mt-6 rounded-full" />
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching home page products:', error);
        // Load fallback sample items if backend fails
        setProducts([
          {
            _id: "sample-1",
            name: "Elegant Golden Silk Saree",
            images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80"],
            category: "Women's Wear",
            description: "Premium Kanchipuram style silk saree.",
            sizes: ["Free Size"],
            colors: ["Gold"],
            price: 4500,
            discountPrice: 2999,
            stockQuantity: 15,
            sku: "WD-SLK-001",
            featured: true
          },
          {
            _id: "sample-2",
            name: "Premium Linen Nehru Jacket Set",
            images: ["https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80"],
            category: "Men's Wear",
            description: "Nehru jacket set.",
            sizes: ["M", "L"],
            colors: ["Ivory White"],
            price: 3500,
            discountPrice: 1999,
            stockQuantity: 25,
            sku: "MD-KRT-002",
            featured: true
          },
          {
            _id: "sample-4",
            name: "24K Gold Plated Royal Necklace Set",
            images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80"],
            category: "Jewellery",
            description: "Traditional royal Kundan choker set.",
            sizes: ["Adjustable"],
            colors: ["Gold-White"],
            price: 6000,
            discountPrice: 3499,
            stockQuantity: 8,
            sku: "JW-KND-004",
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Product Filters
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 4);
  const jewelleryItems = products.filter(p => p.category === 'Jewellery').slice(0, 4);
  const kidsItems = products.filter(p => p.category === "Kids Wear").slice(0, 4);
  const womenItems = products.filter(p => p.category === "Women's Wear").slice(0, 4);
  const menItems = products.filter(p => p.category === "Men's Wear").slice(0, 4);



  return (
    <div className="space-y-12">
      
      {/* 1. Hero banner */}
      <HeroBanner />

      {/* 2. Category grid */}
      <CategoryGrid />

      {/* 3. Promo Banner */}
      <section className="bg-purple-900 py-8 text-white grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl shadow-md border-b-4 border-gold">
        <div className="flex items-center gap-3 justify-center text-center sm:text-left">
          <FiTruck className="text-gold" size={32} />
          <div>
            <h4 className="font-bold text-sm sm:text-base">Free Delivery</h4>
            <p className="text-xs text-purple-200">On all orders above ₹499</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center text-center sm:text-left">
          <FiShield className="text-gold" size={32} />
          <div>
            <h4 className="font-bold text-sm sm:text-base">Secure UPI Payments</h4>
            <p className="text-xs text-purple-200">Direct PhonePe QR code</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center text-center sm:text-left">
          <FiRefreshCw className="text-gold" size={32} />
          <div>
            <h4 className="font-bold text-sm sm:text-base">Easy Exchange</h4>
            <p className="text-xs text-purple-200">7-day hassle free returns</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center text-center sm:text-left">
          <FiPhoneCall className="text-gold" size={32} />
          <div>
            <h4 className="font-bold text-sm sm:text-base">24/7 Support</h4>
            <p className="text-xs text-purple-200">Direct WhatsApp assistance</p>
          </div>
        </div>
      </section>

      {/* 4. Trending / Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-end mb-8 border-b border-purple-100 pb-4">
            <div>
              <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">Weekly Spotlight</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">Trending Products</h2>
            </div>
            <NextLink href="/category/all?sort=latest" className="text-primary hover:text-amber-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
              <span>View All</span>
              <FiArrowRight size={14} />
            </NextLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-end mb-8 border-b border-purple-100 pb-4">
          <div>
            <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">Just Added</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">New Arrivals</h2>
          </div>
          <NextLink href="/category/all?sort=latest" className="text-primary hover:text-amber-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
            <span>View All</span>
            <FiArrowRight size={14} />
          </NextLink>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-purple-100/50 rounded-2xl h-80 animate-pulse-slow" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Women's Fashion Shelf */}
      {womenItems.length > 0 && (
        <section className="bg-purple-50/30 py-12 border-y border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 border-b border-purple-100 pb-4">
              <div>
                <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">Sarees & Ethnic Wear</span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">Women's Fashion</h2>
              </div>
              <NextLink href="/category/women-wear" className="text-primary hover:text-amber-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
                <span>View All</span>
                <FiArrowRight size={14} />
              </NextLink>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {womenItems.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parallax Clothes Showcase Section */}
      <ParallaxShowcase />

      {/* 7. Jewellery Collection Shelf */}
      {jewelleryItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-end mb-8 border-b border-purple-100 pb-4">
            <div>
              <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">Royal Necklaces & Earrings</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">Jewellery Collection</h2>
            </div>
            <NextLink href="/category/jewellery" className="text-primary hover:text-amber-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
              <span>View All</span>
              <FiArrowRight size={14} />
            </NextLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {jewelleryItems.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Men's Fashion Shelf */}
      {menItems.length > 0 && (
        <section className="bg-purple-50/30 py-12 border-y border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 border-b border-purple-100 pb-4">
              <div>
                <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">Kurtas, Blazers & Jackets</span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">Men's Fashion</h2>
              </div>
              <NextLink href="/category/men-wear" className="text-primary hover:text-amber-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
                <span>View All</span>
                <FiArrowRight size={14} />
              </NextLink>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {menItems.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Kids Fashion Shelf */}
      {kidsItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-end mb-8 border-b border-purple-100 pb-4">
            <div>
              <span className="text-amber-600 font-extrabold text-xs tracking-widest uppercase block mb-1">Cute & Stylish Frocks</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">Kids Fashion</h2>
            </div>
            <NextLink href="/category/kids-wear" className="text-primary hover:text-amber-600 font-bold text-sm flex items-center gap-1.5 transition-colors">
              <span>View All</span>
              <FiArrowRight size={14} />
            </NextLink>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {kidsItems.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}



    </div>
  );
}
