import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products as ALL_PRODUCTS } from '../data/products';

// --- MOCK DATA ---
const RECENT_SEARCHES = ['Smartwatches', 'Mens Jackets', 'Sony Headphones', 'Running Shoes'];

const TRENDING_PRODUCTS = [
  { id: 4, title: "Elite Fashion Chrone Wetch", price: "299.99", image: "https://images.unsplash.com/photo-1524592094714-a166ce89bfeca?q=80&w=200&auto=format&fit=crop" },
  { id: 10, title: "Advanced Hydrating Serum", price: "106.99", image: "https://plus.unsplash.com/premium_photo-1764592617946-7e04987b548e?q=80&w=200&auto=format&fit=crop" },
  { id: 22, title: "Ultra HD 4K Monitor", price: "123.45", image: "https://images.unsplash.com/photo-1706290047679-8cd8a8694be1?q=80&w=200&auto=format&fit=crop" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // --- 1. GLOBAL KEYBOARD & EVENT LISTENERS ---
  useEffect(() => {
    // Open via Cmd+K / Ctrl+K
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    // Open via Navbar button Custom Event
    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // --- 2. DEBOUNCE LOGIC (300ms) ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setHighlightedIndex(0); // Reset selection when results change
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // --- 3. FILTERING & FLAT ARRAY MAPPING ---
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const lowerQuery = debouncedQuery.toLowerCase();
    return ALL_PRODUCTS.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Max 8 results
  }, [debouncedQuery]);

  // Compute a flat array of all currently clickable/navigable elements for Arrow Navigation
  const navigableItems = useMemo(() => {
    let items = [];
    if (!debouncedQuery.trim()) {
      // Empty State nav structure
      RECENT_SEARCHES.forEach(r => items.push({ type: 'recent', data: r }));
      TRENDING_PRODUCTS.forEach(p => items.push({ type: 'trending', data: p }));
    } else {
      // Active State nav structure
      results.forEach(p => items.push({ type: 'product', data: p }));
    }
    return items;
  }, [debouncedQuery, results]);

  // --- 4. KEYBOARD NAVIGATION ---
  const handleInputKeyDown = (e) => {
    if (navigableItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % navigableItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + navigableItems.length) % navigableItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeAction(navigableItems[highlightedIndex]);
    }
  };

  // --- 5. ACTIONS ---
  const executeAction = (item) => {
    setIsOpen(false);
    if (!item) return;
    
    if (item.type === 'product' || item.type === 'trending') {
      navigate(`/product/${item.data.id}`);
    } else if (item.type === 'recent') {
      // In a real app, this might navigate to `/shop?search=...`
      setQuery(item.data); 
      setIsOpen(true); // keep open but populate search
    }
  };

  if (!isOpen) return null;

  // --- SUBSTRING HIGHLIGHT COMPONENT ---
  const HighlightedText = ({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span className="truncate">
        {parts.map((part, i) => 
          regex.test(part) ? <span key={i} className="text-[#d946ef] font-bold">{part}</span> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0c] border border-gray-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col mx-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Header */}
        <div className="flex items-center px-4 h-16 border-b border-gray-800 bg-[#131315]">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white px-4 h-full text-lg placeholder:text-gray-500"
            placeholder="Search products, categories, or brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-2 text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="ml-2 px-2 py-0.5 border border-gray-700 bg-gray-800 rounded text-xs text-gray-400 font-mono hidden sm:block shadow-inner">
            ESC
          </div>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto max-h-[60vh] no-scrollbar">
          
          {/* EMPTY STATE */}
          {!debouncedQuery.trim() ? (
            <div className="p-4 flex flex-col gap-8">
              
              {/* Recent Searches */}
              <div>
                <div className="flex items-center justify-between mb-4 px-2">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Searches</h3>
                   <button className="text-xs text-[#a855f7] hover:underline font-medium">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {RECENT_SEARCHES.map((searchStr, idx) => {
                    const mappedIdx = idx;
                    const isFocus = highlightedIndex === mappedIdx;
                    return (
                      <button 
                        key={idx}
                        onMouseEnter={() => setHighlightedIndex(mappedIdx)}
                        onClick={() => executeAction({type: 'recent', data: searchStr})}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                          isFocus 
                          ? 'bg-gray-800 border-[#d946ef] text-white shadow-[0_0_15px_rgba(217,70,239,0.2)]' 
                          : 'bg-[#131315] border-gray-800 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {searchStr}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Trending Products */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                   <TrendingUp className="w-3.5 h-3.5" /> Trending Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRENDING_PRODUCTS.map((prod, idx) => {
                    const mappedIdx = RECENT_SEARCHES.length + idx;
                    const isFocus = highlightedIndex === mappedIdx;
                    return (
                      <div 
                        key={prod.id}
                        onMouseEnter={() => setHighlightedIndex(mappedIdx)}
                        onClick={() => executeAction({type: 'trending', data: prod})}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border-l-4 ${
                          isFocus 
                          ? 'bg-gray-800/80 border-[#d946ef]' 
                          : 'bg-transparent border-transparent hover:bg-[#131315]'
                        }`}
                      >
                         <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex-shrink-0">
                           <img src={prod.image} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply" />
                         </div>
                         <div className="flex flex-col min-w-0">
                           <span className="text-white text-sm font-semibold truncate">{prod.title}</span>
                           <span className="text-[#a855f7] text-xs font-bold">₹{prod.price}</span>
                         </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          ) : (
            
            /* ACTIVE STATE (SEARCH RESULTS) */
            <div className="p-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-4 pt-2">
                 Results ({results.length})
              </h3>
              
              {results.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">
                   <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                   <p>No products found for "{debouncedQuery}"</p>
                 </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {results.map((prod, idx) => {
                    const isFocus = highlightedIndex === idx;
                    return (
                      <div 
                        key={prod.id}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => executeAction({type: 'product', data: prod})}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border-l-4 ${
                          isFocus 
                          ? 'bg-gray-800/80 border-[#d946ef]' 
                          : 'bg-transparent border-transparent hover:bg-[#131315]'
                        }`}
                      >
                         <div className="flex items-center gap-4 min-w-0">
                           <div className="w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0">
                             <img src={prod.image} alt={prod.title} className="w-full h-full object-contain mix-blend-multiply" />
                           </div>
                           <div className="flex flex-col min-w-0 max-w-[400px]">
                             <span className="text-white text-sm font-semibold truncate">
                               <HighlightedText text={prod.title} highlight={debouncedQuery} />
                             </span>
                             <span className="text-gray-500 text-[11px] truncate uppercase">{prod.category}</span>
                           </div>
                         </div>
                         <span className="text-gray-300 text-sm font-bold flex-shrink-0 ml-4">
                            ₹{prod.price}
                         </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-800 bg-[#0a0a0c] p-3 flex justify-between items-center text-xs text-gray-500">
          <div className="flex gap-4">
             <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1 rounded text-white font-sans">↑</kbd><kbd className="bg-gray-800 px-1 rounded text-white font-sans">↓</kbd> to navigate</span>
             <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 rounded text-white font-sans">↵</kbd> to select</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 rounded text-white font-sans">esc</kbd> to dismiss</span>
        </div>

      </div>
    </div>
  );
}
