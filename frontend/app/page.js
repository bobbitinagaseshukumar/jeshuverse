'use client';
import { API_URL } from '../utils/api';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import VideoBackground from '../components/VideoBackground';
import Reveal from '../components/Reveal';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiPhoneCall } from 'react-icons/fi';
import NextLink from 'next/link';

// Luxury centered section heading with gold underline
function SectionHead({ label, title, href }) {
  return (
    <div className="text-center mb-10">
      <span className="text-gold font-medium text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 block">
        {label}
      </span>
      <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {href && (
        <NextLink href={href} className="inline-flex items-center gap-1.5 mt-5 text-gold hover:text-gold-light font-medium text-xs uppercase tracking-wider transition-colors border-b border-gold/30 hover:border-gold pb-0.5">
          <span>View All</span>
          <FiArrowRight size={12} />
        </NextLink>
      )}
    </div>
  );
}

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

  const translateY = (offsetY * 0.12) % 180;

  return (
    <section className="parallax-section relative w-full overflow-hidden border-y border-white/5 max-w-7xl mx-auto my-6 sm:rounded-lg shadow-2xl">
      <div
        className="parallax-bg"
        style={{
          transform: `translateY(${translateY}px) scale(1.05)`,
          backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1500&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none">
        <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-5" />
        <span className="text-gold font-medium text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3 block">
          JESHUVERSE LUXURY STUDIO
        </span>
        <h3 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight max-w-3xl">
          Where Heritage Weaves Meet Contemporary Style
        </h3>
        <p className="mt-4 text-gray-400 text-xs sm:text-base max-w-xl font-light leading-relaxed">
          Sourced from traditional artisans, our designer sarees, ethnic wear, and luxury sets are crafted to celebrate you.
        </p>
        <div className="w-12 h-[3px] bg-gradient-to-r from-gold-dark via-gold to-gold-dark mt-6 rounded-full" />
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

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.slice(0, 4);
  const jewelleryItems = products.filter(p => p.category === 'Jewellery').slice(0, 4);
  const kidsItems = products.filter(p => p.category === "Kids Wear").slice(0, 4);
  const womenItems = products.filter(p => p.category === "Women's Wear").slice(0, 4);
  const menItems = products.filter(p => p.category === "Men's Wear").slice(0, 4);

  const features = [
    { icon: FiTruck, title: 'Free Delivery', desc: 'On all orders above ₹499' },
    { icon: FiShield, title: 'Secure Payments', desc: 'Direct PhonePe QR code' },
    { icon: FiRefreshCw, title: 'Easy Exchange', desc: '7-day hassle free returns' },
    { icon: FiPhoneCall, title: '24/7 Support', desc: 'Direct WhatsApp assistance' },
  ];

  return (
    <div className="relative text-white">
      {/* Cinematic video backdrop */}
      <VideoBackground />

      <div className="relative z-10 space-y-16">
        {/* 1. Hero banner */}
        <HeroBanner />

        {/* 2. Category grid */}
        <CategoryGrid />

        {/* 3. Trust bar — dark card with gold icons */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0d0d0d] border border-white/8 rounded-lg py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            {features.map((f, i) => (
              <Reveal key={i} direction="up" delay={i * 0.08} className="flex items-center gap-3 justify-center text-center sm:text-left">
                <f.icon className="text-gold shrink-0" size={28} />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-white">{f.title}</h4>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. Trending / Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Reveal><SectionHead label="Curated Masterpieces" title="Spotlight Trending" href="/category/all?sort=latest" /></Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product, i) => (
                <Reveal key={product._id} direction="up" delay={i * 0.06}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* 5. New Arrivals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Reveal><SectionHead label="Fresh Additions" title="New Arrivals" href="/category/all?sort=latest" /></Reveal>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white/5 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product, i) => (
                <Reveal key={product._id} direction="up" delay={i * 0.06}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* 6. Women's Fashion Shelf */}
        {womenItems.length > 0 && (
          <section className="bg-black/40 backdrop-blur-xl py-14 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal><SectionHead label="Sarees & Ethnic Wear" title="Women's Signature Collection" href="/category/women-wear" /></Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {womenItems.map((product, i) => (
                  <Reveal key={product._id} direction="up" delay={i * 0.06}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Parallax Showcase Section */}
        <ParallaxShowcase />

        {/* 7. Jewellery Collection Shelf */}
        {jewelleryItems.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Reveal><SectionHead label="Royal Chokers & Rings" title="Exquisite Jewellery Collection" href="/category/jewellery" /></Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {jewelleryItems.map((product, i) => (
                <Reveal key={product._id} direction="up" delay={i * 0.06}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* 8. Men's Fashion Shelf */}
        {menItems.length > 0 && (
          <section className="bg-black/40 backdrop-blur-xl py-14 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal><SectionHead label="Designer Kurtas & Blazers" title="Men's Elite Collection" href="/category/men-wear" /></Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {menItems.map((product, i) => (
                  <Reveal key={product._id} direction="up" delay={i * 0.06}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Kids Fashion Shelf */}
        {kidsItems.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Reveal><SectionHead label="Stylised Children's Outfits" title="Kids Trendy Fashions" href="/category/kids-wear" /></Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {kidsItems.map((product, i) => (
                <Reveal key={product._id} direction="up" delay={i * 0.06}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
