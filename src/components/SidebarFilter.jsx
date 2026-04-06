import React, { useState } from 'react';
import { Star, Flame, Zap, Sparkles, Check } from 'lucide-react';

const COLORS_LIST = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#d946ef' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#000000' }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const STATUSES = [
  { id: 'hot', label: 'HOT', icon: Flame, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  { id: 'new', label: 'NEW', icon: Sparkles, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'sale', label: 'SALE', icon: Zap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
];

export default function SidebarFilter({ onFilterChange, availableFilterData }) {
  const [filters, setFilters] = useState({
    price: [0, 100000],
    colors: [],
    sizes: [],
    rating: null,
    statuses: []
  });

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      const newFilters = { ...prev, [key]: next };
      // Optional: Auto-apply on simple selections? The prompt suggests a button.
      return newFilters;
    });
  };

  const setRating = (val) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === val ? null : val }));
  };

  const handlePriceChange = (index, value) => {
    setFilters(prev => {
      const nextPrice = [...prev.price];
      nextPrice[index] = Number(value);
      // Ensure min <= max
      if (index === 0 && nextPrice[0] > nextPrice[1]) nextPrice[0] = nextPrice[1];
      if (index === 1 && nextPrice[1] < nextPrice[0]) nextPrice[1] = nextPrice[0];
      return { ...prev, price: nextPrice };
    });
  };

  const handleApply = () => {
    if (onFilterChange) onFilterChange(filters);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-8 pr-4 lg:border-r border-gray-800/50">
      
      {/* Price Range */}
      <div>
        <h3 className="font-bold text-white mb-4">Price Range</h3>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>₹{filters.price[0]}</span>
          <span>₹{filters.price[1]}+</span>
        </div>
        <div className="relative h-6 flex items-center">
          <input 
            type="range" min="0" max="100000" value={filters.price[0]} 
            onChange={(e) => handlePriceChange(0, e.target.value)}
            onMouseUp={handleApply}
            className="absolute w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#a855f7] z-10"
          />
          <input 
            type="range" min="0" max="100000" value={filters.price[1]} 
            onChange={(e) => handlePriceChange(1, e.target.value)}
            onMouseUp={handleApply}
            className="absolute w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer accent-[#a855f7] z-20 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto"
          />
        </div>
        <p className="text-xs text-[#a855f7] mt-3 font-medium">₹{filters.price[0]} - ₹{filters.price[1]}</p>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-bold text-white mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {COLORS_LIST.map(color => (
            <button 
              key={color.name}
              onClick={() => toggleFilter('colors', color.hex)}
              className={`w-6 h-6 rounded-full border-2 transition-all p-0.5 ${filters.colors.includes(color.hex) ? 'border-[#a855f7] scale-110' : 'border-transparent hover:border-gray-600'}`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {filters.colors.includes(color.hex) && <Check className={`w-full h-full ${color.name === 'White' ? 'text-black' : 'text-white'} p-0.5`} />}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-bold text-white mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map(size => (
            <button 
              key={size}
              onClick={() => toggleFilter('sizes', size)}
              className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${filters.sizes.includes(size) ? 'bg-[#a855f7] border-[#a855f7] text-white' : 'bg-[#1a1a1c] border-gray-800 text-gray-300 hover:border-gray-500 hover:text-white'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h3 className="font-bold text-white mb-4">Minimum Rating</h3>
        <div className="flex flex-col gap-3">
          {[4.5, 4, 3, 2].map((val) => (
            <label key={val} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="rating" 
                checked={filters.rating === val}
                onChange={() => setRating(val)}
                className="w-4 h-4 rounded-full bg-gray-800 border-gray-600 accent-[#a855f7] cursor-pointer" 
              />
              <div className="flex items-center gap-1.5 font-medium">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(val) ? 'text-amber-500 fill-amber-500' : 'text-gray-700 fill-gray-700'}`} />
                  ))}
                </div>
                <span className={`text-sm transition-colors ${filters.rating === val ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  {val}+ Stars
                </span>
              </div>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="rating" 
              checked={filters.rating === null}
              onChange={() => setRating(null)}
              className="w-4 h-4 rounded-full bg-gray-800 border-gray-600 accent-[#a855f7] cursor-pointer" 
            />
            <span className={`text-sm transition-colors ${filters.rating === null ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
              Any Rating
            </span>
          </label>
        </div>
      </div>

      {/* Status Badges */}
      <div>
        <h3 className="font-bold text-white mb-4">Availability</h3>
        <div className="flex flex-col gap-3">
          {STATUSES.map((status) => {
            const Icon = status.icon;
            const isSelected = filters.statuses.includes(status.id);
            return (
              <label key={status.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => toggleFilter('statuses', status.id)}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-600 accent-[#a855f7] cursor-pointer" 
                />
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-extrabold tracking-wider transition-all ${status.color} ${isSelected ? 'scale-105 border-white/20' : 'opacity-70 group-hover:opacity-100'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {status.label}
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Apply Filters */}
      <button 
        onClick={handleApply}
        className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-extrabold text-sm text-white hover:opacity-90 transition-all shadow-[0_10px_20px_rgba(217,70,239,0.15)] active:scale-95"
      >
        Apply Filters
      </button>

    </aside>
  );
}
