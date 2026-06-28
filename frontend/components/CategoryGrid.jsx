'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingProgress, setBookingProgress] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0]);
          setSelectedSeat({ row: 'A', number: 4 });
        }
      } catch (err) {
        console.error('Error fetching dynamic categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSeatClick = (category, rowIndex, seatIndex) => {
    setSelectedCategory(category);
    const rowChar = String.fromCharCode(65 + rowIndex); // A, B, C...
    setSelectedSeat({ row: rowChar, number: seatIndex + 1 });
    
    // Quick ticket booking flash effect
    setBookingProgress(true);
    setTimeout(() => setBookingProgress(false), 600);
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const rowColors = [
    { activeBg: 'bg-gold', activeBorder: 'border-gold', glow: 'shadow-gold/50', labelColor: 'text-gold' },
    { activeBg: 'bg-primary-light', activeBorder: 'border-primary-light', glow: 'shadow-purple-500/50', labelColor: 'text-purple-400' },
    { activeBg: 'bg-rose-500', activeBorder: 'border-rose-400', glow: 'shadow-rose-500/50', labelColor: 'text-rose-400' },
    { activeBg: 'bg-cyan-400', activeBorder: 'border-cyan-400', glow: 'shadow-cyan-400/50', labelColor: 'text-cyan-400' },
    { activeBg: 'bg-emerald-500', activeBorder: 'border-emerald-400', glow: 'shadow-emerald-500/50', labelColor: 'text-emerald-400' }
  ];

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Headings */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-shine font-black text-xs tracking-widest uppercase mb-2 block">
          Interactive Cinema Hub
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight drop-shadow-lg">
          Select Your Style Row
        </h2>
        <div className="luxury-divider" />
      </div>

      {/* Screen Line representation */}
      <div className="relative max-w-2xl mx-auto mb-14 flex flex-col items-center">
        <div className="w-full h-1 bg-gradient-to-r from-amber-500/0 via-gold to-amber-500/0 rounded-full shadow-[0_0_25px_rgba(234,179,8,0.9)]" />
        <div className="w-full h-8 bg-gradient-to-b from-gold/5 to-transparent blur-md" />
        <span className="text-[10px] text-purple-300 font-extrabold tracking-widest uppercase -mt-3.5 bg-[#0b0813] px-4 block border border-white/5 rounded-full py-0.5">
          Cinema Projection Screen
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 3D Theatre Seating Selector (8 Columns in grid) */}
        <div className="lg:col-span-8 glass-dark-premium border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Subtle theater backdrop atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {categories.map((cat, rowIndex) => {
              const theme = rowColors[rowIndex % rowColors.length];
              const isRowSelected = selectedCategory?._id === cat._id;
              
              return (
                <div key={cat._id || cat.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-white/5 pb-5 last:border-0 last:pb-0">
                  {/* Row Indicator */}
                  <div className="w-28 shrink-0 flex flex-col">
                    <span className="text-[10px] font-black text-purple-400/60 uppercase tracking-widest">
                      Row {String.fromCharCode(65 + rowIndex)}
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wider truncate ${isRowSelected ? theme.labelColor : 'text-white'}`}>
                      {cat.name}
                    </span>
                  </div>

                  {/* Row Seats (8 seats per row) */}
                  <div className="flex-1 flex flex-wrap gap-2.5">
                    {Array.from({ length: 8 }).map((_, seatIndex) => {
                      const isSeatSelected = isRowSelected && selectedSeat?.number === (seatIndex + 1);
                      
                      return (
                        <button
                          key={seatIndex}
                          onClick={() => handleSeatClick(cat, rowIndex, seatIndex)}
                          title={`Select ${cat.name} (Row ${String.fromCharCode(65 + rowIndex)}, Seat ${seatIndex + 1})`}
                          className={`w-8 h-8 rounded-t-xl rounded-b-md border transition-all duration-300 flex flex-col items-center justify-between py-1 relative cursor-interactive ${
                            isSeatSelected 
                              ? `${theme.activeBg} ${theme.activeBorder} text-primary-dark shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-110` 
                              : isRowSelected
                                ? 'bg-white/15 border-white/30 text-white hover:bg-white/30'
                                : 'bg-white/5 border-white/10 text-purple-300/40 hover:bg-white/10 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <span className="text-[7px] font-black leading-none uppercase">
                            {String.fromCharCode(65 + rowIndex)}{seatIndex + 1}
                          </span>
                          <div className={`w-4 h-0.5 rounded-full ${isSeatSelected ? 'bg-primary-dark/60' : 'bg-white/20'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seat Status Legend */}
          <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-white/5 text-[10px] font-bold uppercase tracking-wider text-purple-300/80">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/5 border border-white/10 rounded-t-md rounded-b" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/20 border border-white/30 rounded-t-md rounded-b" />
              <span>Selected Row</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gold border border-gold rounded-t-md rounded-b shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-pulse" />
              <span>Selected Ticket</span>
            </div>
          </div>
        </div>

        {/* Right: Booking Stub Box Detail (4 Columns in grid) */}
        <div className="lg:col-span-4 relative h-full">
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full relative bg-[#1c132c]/95 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col space-y-5 overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(88,28,135,0.2) 0%, rgba(234,179,8,0.03) 100%)`
                }}
              >
                {/* Cinema Ticket Stub Perforated Top Detail */}
                <div className="absolute top-0 inset-x-0 flex justify-between px-6 -mt-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-[#0b0813] border-b border-white/10 shrink-0" />
                  ))}
                </div>

                <div className="pt-4 text-center">
                  <span className="text-[10px] font-black text-gold uppercase tracking-widest block mb-1">
                    JESHUVERSE CINE-PASS
                  </span>
                  <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                    RESERVED TICKET
                  </h3>
                </div>

                {/* Ticket Body details */}
                <div className="border-y border-dashed border-white/15 py-4.5 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-300 font-bold uppercase">Department</span>
                    <span className="text-white font-black uppercase text-sm">{selectedCategory.name}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-300 font-bold uppercase">Reserved Row & Seat</span>
                    <span className="text-gold font-mono font-black text-sm">
                      ROW {selectedSeat?.row || 'A'} - SEAT {selectedSeat?.number || 4}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-300 font-bold uppercase">Ticket Status</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1.5 animate-pulse uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Ready to Enter
                    </span>
                  </div>
                </div>

                {/* Picture Preview */}
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative shadow-inner">
                  <img
                    src={selectedCategory.image || '/placeholder-category.png'}
                    alt={selectedCategory.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c132c] via-transparent to-transparent opacity-90" />
                </div>

                {/* Action button */}
                <NextLink
                  href={`/category/${selectedCategory.slug}`}
                  className="w-full btn-premium btn-ripple block text-center bg-gold hover:bg-gold-light text-primary-dark font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-gold/25"
                >
                  {bookingProgress ? 'Confirming Ticket...' : 'Enter Booking Hall →'}
                </NextLink>

                <p className="text-[9px] text-purple-300/60 text-center font-bold uppercase">
                  *Clicking seat row sets your category filter! Click enter booking hall to view full page.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
