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

// Section heading shared across the dark home page
function SectionHead({ label, title, href }) {
  return (
    <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
      <div className="flex items-start gap-3">
        <div className="bg-gold/15 border border-gold/30 rounded-xl w-10 h-10 flex items-center justify-center text-gold text-lg shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
          ✨
        </div>
        <div>
          <span className="text-gold font-extrabold text-[10px] tracking-widest uppercase block mb-0.5">{label}</span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">{title}</h2>
        </div>
      </div>
      {href && (
        <NextLink href={href} className="text-gold hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors">
          <span>Explore All</span>
          <FiArrowRight size={14} />
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
    <section className="parallax-section relative w-full overflow-hidden border-y border-white/10 max-w-7xl mx-auto my-6 sm:rounded-3xl shadow-2xl">
      <div
        className="parallax-bg"
        style={{
          transform: `translateY(${translateY}px) scale(1.05)`,
          backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1500&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none">
        <span className="text-gold font-extrabold text-[10px] sm:text-xs tracking-widest uppercase mb-3 block animate-pulse">
          JESHUVERSE LUXURY STUDIO
        </span>
        <h3 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight max-w-3xl">
          Where Heritage Weaves Meet Contemporary Style
        </h3>
        <p className="mt-4 text-purple-100/80 text-xs sm:text-base max-w-xl font-medium leading-relaxed">
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
    { icon: FiShield, title: 'Secure UPI Payments', desc: 'Direct PhonePe QR code' },
    { icon: FiRefreshCw, title: 'Easy Exchange', desc: '7-day hassle free returns' },
    { icon: FiPhoneCall, title: '24/7 Support', desc: 'Direct WhatsApp assistance' },
  ];

  return (
    <div className="relative text-white">
      {/* Cinematic video backdrop (visible through the dark glass theme) */}
      <VideoBackground />

      <div className="relative z-10 space-y-12">
        {/* 1. Hero banner */}
        <HeroBanner />

        {/* 2. Category grid */}
        <CategoryGrid />

        {/* 3. Promo / trust bar — dark glass */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-dark-premium rounded-3xl border border-white/10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 px-6 shadow-2xl">
            {features.map((f, i) => (
              <Reveal key={i} direction="up" delay={i * 0.08} className="flex items-center gap-3 justify-center text-center sm:text-left">
                <f.icon className="text-gold shrink-0" size={32} />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">{f.title}</h4>
                  <p className="text-xs text-purple-100/70">{f.desc}</p>
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
                <div key={n} className="bg-white/10 rounded-2xl h-80 animate-pulse" />
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
          <section className="bg-black/35 backdrop-blur-xl py-12 border-y border-white/5">
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

        {/* Parallax Clothes Showcase Section */}
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
          <section className="bg-black/35 backdrop-blur-xl py-12 border-y border-white/5">
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
