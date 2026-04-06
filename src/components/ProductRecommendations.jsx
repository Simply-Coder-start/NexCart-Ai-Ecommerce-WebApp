import React, { useState } from 'react';
import { Plus, Check, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ACCESSORY = {
  id: 999,
  title: "Premium Scratch-Resistant Tempered Glass Screen Protector (Pack of 2)",
  price: 299,
  image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop"
};

const MOCK_RECOMMENDATIONS = [
  { id: 101, title: "Proxima Elite Smartwatch with 1.9\" AMOLED Display, BT Calling", price: 2999, originalPrice: 6599, rating: 4.2, reviews: 1240, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop" },
  { id: 102, title: "Aura Watch Series 5 - Advanced Health Tracking, ECG, GPS", price: 5499, originalPrice: 12999, rating: 4.8, reviews: 932, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop" },
  { id: 103, title: "Velocity Fitness Tracker - 14 Days Battery, Heart Rate", price: 1499, originalPrice: 3999, rating: 4.0, reviews: 320, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop" },
  { id: 104, title: "Infinity Gear 4 Premium Steel Smartwatch for Men", price: 8999, originalPrice: 15499, rating: 4.5, reviews: 156, image: "https://images.unsplash.com/photo-1517420879255-ae365c7820e1?q=80&w=800&auto=format&fit=crop" },
  { id: 105, title: "Lumina Watch 2 [41mm] Pink Aluminum Case with Sport Band", price: 3499, originalPrice: 7900, rating: 4.7, reviews: 451, image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=800&auto=format&fit=crop" },
  { id: 106, title: "Zenith Sport Smartwatch - Waterproof 5ATM, SpO2 Tracker", price: 2199, originalPrice: 5999, rating: 4.1, reviews: 88, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" },
  { id: 107, title: "Orbit Active 3 - Rugged Tactical Smartwatch GPS Built-in", price: 6200, originalPrice: 10999, rating: 4.6, reviews: 521, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" },
  { id: 108, title: "Nova Classic Leather Smartwatch for Business Android/iOS", price: 4100, originalPrice: 9500, rating: 4.3, reviews: 1105, image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800&auto=format&fit=crop" },
];

import { useCart } from '../context/CartContext';

export default function ProductRecommendations({ currentProduct }) {
  const { addToCart } = useCart();
  // State to track which items are checked in "Frequently bought together"
  const [checkedItems, setCheckedItems] = useState({
    main: true,
    accessory: true
  });

  // Safe fallback if currentProduct is somehow missing data
  const mainPrice = parseFloat(currentProduct?.price || 0) || 0;
  
  // Calculate total price based on checked state
  const totalPrice = (checkedItems.main ? mainPrice : 0) + (checkedItems.accessory ? MOCK_ACCESSORY.price : 0);

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="w-full flex flex-col gap-16 pb-12 pt-8 border-t border-gray-800">
      
      {/* SECTION 1: Frequently Bought Together */}
      <section>
        <h2 className="text-2xl font-extrabold text-white mb-6">Frequently bought together</h2>
        
        <div className="bg-[#131315] border border-gray-800 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-8 shadow-xl">
          
          {/* Visual Product Nodes */}
          <div className="flex items-center flex-wrap gap-4 xs:gap-6 flex-1">
            {/* Main Product Thumbnail */}
            <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-white p-2 border-2 transition-all ${checkedItems.main ? 'border-[#d946ef] shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'border-gray-700 opacity-50'}`}>
               <img 
                 src={currentProduct?.image || MOCK_RECOMMENDATIONS[0].image} 
                 alt="Main Item" 
                 referrerPolicy="no-referrer"
                 onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/131315/d946ef/svg?text=Item`; }}
                 className="w-full h-full object-contain mix-blend-multiply" 
               />
               {checkedItems.main && (
                 <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#d946ef] border-2 border-[#131315] flex items-center justify-center">
                   <Check className="w-3.5 h-3.5 text-white" />
                 </div>
               )}
            </div>

            <Plus className="w-8 h-8 text-gray-600" />

            {/* Accessory Thumbnail */}
            <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-white p-2 border-2 transition-all ${checkedItems.accessory ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-700 opacity-50'}`}>
               <img 
                 src={MOCK_ACCESSORY.image} 
                 alt="Accessory" 
                 referrerPolicy="no-referrer"
                 onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/131315/3b82f6/svg?text=AddOn`; }}
                 className="w-full h-full object-contain mix-blend-multiply" 
               />
               {checkedItems.accessory && (
                 <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#131315] flex items-center justify-center">
                   <Check className="w-3.5 h-3.5 text-white" />
                 </div>
               )}
            </div>
          </div>

          {/* Pricing & Selection Math */}
          <div className="lg:w-[350px] flex-shrink-0 flex flex-col gap-4 w-full">
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Total price:</h3>
            <div className="text-4xl font-extrabold text-white">₹{totalPrice.toLocaleString()}</div>
            
            <button 
              onClick={() => {
                if (checkedItems.main) addToCart(currentProduct);
                if (checkedItems.accessory) addToCart(MOCK_ACCESSORY);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 mt-2"
            >
              <ShoppingCart className="w-5 h-5 fill-white" /> Add selected to Cart
            </button>

            <div className="flex flex-col gap-3 mt-4">
              {/* Checkbox item 1 */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={checkedItems.main} 
                  onChange={() => toggleCheck('main')}
                  className="mt-1 w-[18px] h-[18px] rounded bg-[#1a1a1c] border-gray-600 accent-[#d946ef] cursor-pointer shrink-0" 
                />
                <div className="text-sm">
                  <span className={`transition-colors ${checkedItems.main ? 'text-white' : 'text-gray-500 line-through'}`}>
                    <span className="font-bold">This item:</span> {currentProduct?.title || "Product details loading..."}
                  </span>
                  <div className={`mt-0.5 font-bold ${checkedItems.main ? 'text-[#a855f7]' : 'text-gray-600'}`}>₹{mainPrice.toLocaleString()}</div>
                </div>
              </label>

              {/* Checkbox item 2 */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={checkedItems.accessory} 
                  onChange={() => toggleCheck('accessory')}
                  className="mt-1 w-[18px] h-[18px] rounded bg-[#1a1a1c] border-gray-600 accent-blue-500 cursor-pointer shrink-0" 
                />
                <div className="text-sm">
                  <span className={`transition-colors ${checkedItems.accessory ? 'text-white' : 'text-gray-500 line-through'}`}>
                    {MOCK_ACCESSORY.title}
                  </span>
                  <div className={`mt-0.5 font-bold ${checkedItems.accessory ? 'text-blue-400' : 'text-gray-600'}`}>₹{MOCK_ACCESSORY.price.toLocaleString()}</div>
                </div>
              </label>
            </div>
          </div>
          
        </div>
      </section>

      {/* SECTION 2: Customers who viewed this item also viewed */}
      <section>
        <h2 className="text-2xl font-extrabold text-white mb-6">Customers who viewed this item also viewed</h2>
        
        {/* Horizontal Carousel */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x pb-8 -mx-4 px-4 md:mx-0 md:px-0">
          {MOCK_RECOMMENDATIONS.map((item) => {
            const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
            return (
              <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="w-[160px] sm:w-[200px] shrink-0 snap-start bg-[#131315] border border-gray-800 rounded-2xl p-3 shadow-lg hover:border-gray-600 transition-colors group flex flex-col h-full relative cursor-pointer"
              >
                
                {/* Limited Time Badge */}
                {discount > 40 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-tl-2xl rounded-br-lg z-10">
                    Limited time deal
                  </div>
                )}

                {/* Display Image */}
                <div className="relative aspect-square w-full bg-white rounded-xl mb-3 p-3 border border-gray-700 shadow-inner overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x400/131315/d946ef/svg?text=Item`; }}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                {/* Info Text */}
                <h3 className="text-[12px] sm:text-[13px] font-semibold text-blue-400 hover:text-[#d946ef] hover:underline transition-colors line-clamp-2 leading-snug mb-2 flex-grow">
                  {item.title}
                </h3>

                
                {/* Ratings */}
                <div className="flex items-center gap-1 mb-2 mt-auto text-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-700 fill-gray-700'}`} />
                    ))}
                  </div>
                  <span className="text-[#a855f7] font-medium ml-1">{item.reviews}</span>
                </div>

                {/* Price block */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-500/10 text-red-500 text-xs font-black px-1.5 py-0.5 rounded">-{discount}%</span>
                  <span className="text-xl font-extrabold text-white">₹{item.price.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  M.R.P: <span className="line-through">₹{item.originalPrice.toLocaleString()}</span>
                </div>

              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
