import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const SORT_OPTIONS = [
  'Recommended',
  'Price: Low to High',
  'Price: High to Low',
  'Newest Arrivals',
  'Top Rated'
];

export default function SortAndFilter({ onSortChange, onToggleFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSort, setActiveSort] = useState('Recommended');
  const dropdownRef = useRef(null);

  // Click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (option) => {
    setActiveSort(option);
    setIsOpen(false);
    if (onSortChange) onSortChange(option);
  };

  return (
    <div className="flex items-center gap-3 relative" ref={dropdownRef}>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-[#131315] text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Sort by: {activeSort} 
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-[#131315] border border-gray-800 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="py-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSortSelect(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    activeSort === option 
                    ? 'text-[#d946ef] bg-gray-800/30 border-l-2 border-[#d946ef]' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={onToggleFilters}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-[#131315] text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters
      </button>
    </div>
  );
}
