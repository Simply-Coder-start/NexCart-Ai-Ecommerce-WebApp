import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, Shirt, Monitor, Home as HomeIcon, 
  Book, Trophy, Sparkles, Heart, Zap, ArrowLeftRight, Star, Search, ShoppingCart, Loader2
} from 'lucide-react';
import api from '../api/api';
import SortAndFilter from '../components/SortAndFilter';
import SidebarFilter from '../components/SidebarFilter';
import { useCart } from '../context/CartContext';
import { products as ALL_PRODUCTS } from '../data/products';

export default function Shop() {
  const { addToCart, toggleFavorite, favorites, compareList, addToCompare, removeFromCompare } = useCart();
  
  // State for filtering
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('Recommended');
  const [activeFilters, setActiveFilters] = useState({
    price: [0, 100000],
    colors: [],
    sizes: [],
    rating: null,
    statuses: []
  });

  // Dynamic Category Pills Data
  const CATEGORY_PILLS = [
    { name: 'All Products', count: ALL_PRODUCTS.length, icon: LayoutGrid },
    { name: 'Fashion', count: 20, icon: Shirt },
    { name: 'Electronics', count: 20, icon: Monitor },
    { name: 'Home & Kitchen', count: 20, icon: HomeIcon },
    { name: 'Books', count: 20, icon: Book },
    { name: 'Sports', count: 20, icon: Trophy },
    { name: 'Beauty', count: 20, icon: Sparkles },
  ];

  // Filter products based on selected category and price slider
  const filteredProducts = useMemo(() => {
    const filtered = ALL_PRODUCTS.filter(product => {
      // 1. Category Filter
      const matchCategory = activeCategory === 'All Products' || product.category === activeCategory.toUpperCase();
      
      // 2. Price Filter
      const price = parseFloat(product.price);
      const matchPrice = price >= activeFilters.price[0] && price <= activeFilters.price[1];

      // 3. Color Filter
      const matchColor = activeFilters.colors.length === 0 || 
        (product.colors && product.colors.some(c => activeFilters.colors.includes(c)));

      // 4. Rating Filter
      const matchRating = !activeFilters.rating || parseFloat(product.rating) >= activeFilters.rating;

      // 5. Size/Status
      const matchSize = activeFilters.sizes.length === 0 || true; 
      const matchStatus = activeFilters.statuses.length === 0 || true;

      return matchCategory && matchPrice && matchColor && matchRating && matchSize && matchStatus;
    });

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      const ratingA = parseFloat(a.rating);
      const ratingB = parseFloat(b.rating);

      switch (sortBy) {
        case 'Price: Low to High':
          return priceA - priceB;
        case 'Price: High to Low':
          return priceB - priceA;
        case 'Top Rated':
          return ratingB - ratingA;
        case 'Newest Arrivals':
          return b.id - a.id; 
        default:
          return 0; 
      }
    });
  }, [activeCategory, activeFilters, sortBy]);

  const [addingToCartId, setAddingToCartId] = useState(null);

  const handleAddToCart = async (product) => {
    setAddingToCartId(product.id);
    try {
      // 1. Update Frontend Context immediately for snappy UI
      addToCart(product);

      // 2. Sync with Backend
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1,
        color: product.colors?.[0] || 'default',
        protectionPlan: false
      });
      
      // Notify other components if needed
      window.dispatchEvent(new Event('update-cart-count'));
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Optional: Revert local state if backend fail?
    } finally {
      setAddingToCartId(null);
    }
  };

  return (
    <main className="max-w-[1600px] mx-auto px-8 pt-10 pb-20 w-full flex flex-col flex-1">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
            Explore <span className="bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#f472b6] text-transparent bg-clip-text">Collection</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Showing {filteredProducts.length} of {ALL_PRODUCTS.length} products
          </p>
        </div>
        
        <SortAndFilter 
          onSortChange={(option) => setSortBy(option)} 
          onToggleFilters={() => console.log('Toggle Filters Sidebar')} 
        />
      </div>

      {/* Categories Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-gray-800/50 mb-8">
        {CATEGORY_PILLS.map((pill, idx) => {
          const Icon = pill.icon;
          const isActive = activeCategory === pill.name;
          return (
            <button 
              key={idx}
              onClick={() => setActiveCategory(pill.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                isActive 
                ? 'bg-gradient-to-r from-[#d946ef] to-[#db2777] text-white shadow-[0_0_15px_rgba(217,70,239,0.25)] border-transparent' 
                : 'bg-[#131315] border border-gray-800 text-gray-300 hover:border-gray-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {pill.name}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ml-1 ${isActive ? 'bg-black/20 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        <SidebarFilter onFilterChange={(newFilters) => setActiveFilters(newFilters)} />

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
          {filteredProducts.length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
               <Search className="w-12 h-12 mb-4 opacity-50" />
               <p className="text-xl font-bold text-white">No products found</p>
               <p>Try adjusting your price filter or category.</p>
             </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-[#131315] rounded-2xl border border-gray-800/80 overflow-hidden group hover:border-gray-600 transition-colors shadow-lg">
                
                {/* Image Area */}
                <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="absolute inset-0 z-0 block">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x800/131315/d946ef/svg?text=${encodeURIComponent(product.title.split(' ').slice(0,2).join(' '))}`;
                      }}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                  </Link>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#131315] via-[#131315]/80 to-transparent flex items-end justify-center pb-4">
                    <span className="text-gray-400/90 font-black text-xl tracking-[0.2em]">{product.category}</span>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#131315]/80 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-[#a855f7] hover:border-[#a855f7] transition-all group/btn"
                  >
                    <Heart className={`w-4 h-4 text-white group-hover/btn:fill-white ${favorites.includes(product.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Details Area */}
                <div className="p-3 md:p-4 flex flex-col gap-1.5 relative z-10 bg-[#131315]">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="flex gap-1">
                        {product.colors && product.colors.map((color, idx) => (
                           <div key={idx} className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }} />
                        ))}
                     </div>
                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1 ml-1">
                       <div className="w-1 h-1 rounded-full bg-[#a855f7]"></div> {product.category}
                     </span>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm md:text-base font-bold text-white truncate hover:text-[#d946ef] transition-colors">{product.title}</h3>
                  </Link>
                  
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-700 fill-gray-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#a855f7]">{product.rating}</span>
                    <span className="text-[10px] text-gray-500 font-medium">({product.reviews})</span>
                  </div>

                  <div className="text-base md:text-lg font-bold text-white mb-2.5">
                    ₹{product.price}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-[1fr_auto_auto] gap-1.5">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="h-9 md:h-10 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-bold text-[10px] md:text-xs text-white flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" /> Buy Now
                    </button>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCartId === product.id}
                      className="h-9 md:h-10 px-2.5 rounded-xl bg-[#1a1a1c] border border-gray-800 flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors text-xs font-semibold text-gray-300 disabled:opacity-50"
                    >
                      {addingToCartId === product.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => {
                        if (compareList.find(c => c.id === product.id)) {
                          removeFromCompare(product.id);
                        } else {
                          addToCompare(product);
                        }
                      }}
                      className={`h-9 md:h-10 px-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                        compareList.find(c => c.id === product.id)
                        ? 'bg-[#a855f7]/20 border-[#a855f7] text-[#d946ef]'
                        : 'bg-[#1a1a1c] border-gray-800 hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
