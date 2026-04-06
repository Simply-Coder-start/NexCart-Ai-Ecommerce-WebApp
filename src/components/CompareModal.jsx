import React from 'react';
import { X, CheckCircle2, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CompareModal({ onClose }) {
  const { compareList, removeFromCompare, addToCart } = useCart();

  // If closed or empty, render nothing
  if (compareList.length === 0) {
    onClose();
    return null;
  }

  // Helper to get specs or mock them if they don't exist
  const getSpecs = (product) => {
    return {
      Category: product.category || 'N/A',
      Rating: `${product.rating || 'N/A'} (${product.reviews || 0} reviews)`,
      AvailableColors: product.colors ? product.colors.length : 'N/A',
      Sizes: 'S, M, L, XL', // Mocked as data doesn't have it standard
      Availability: 'In Stock',
      Shipping: 'Free Delivery',
    };
  };

  const specsKeys = ['Category', 'Rating', 'AvailableColors', 'Sizes', 'Availability', 'Shipping'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 z-0"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-5xl bg-[#131315] border border-gray-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Compare Products</h2>
            <p className="text-gray-400 text-sm mt-1">{compareList.length} items selected</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#1a1a1c] border border-gray-800 flex items-center justify-center hover:bg-gray-800 hover:text-white text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-6 custom-scrollbar">
          <div className="min-w-max flex gap-8">
            
            {/* Spec Labels Column */}
            <div className="w-48 shrink-0 flex flex-col justify-end">
              <div className="h-[220px]"></div> {/* Spacer for product images */}
              <div className="flex flex-col gap-6 uppercase tracking-wider text-xs font-bold text-gray-500 py-4">
                {specsKeys.map(key => (
                  <div key={key} className="h-6 flex items-center">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                ))}
              </div>
            </div>

            {/* Product Columns */}
            {compareList.map(product => {
              const specs = getSpecs(product);
              return (
                <div key={product.id} className="w-64 shrink-0 flex flex-col relative group">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-20"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Product Header (Image + Title + Price) */}
                  <div className="h-[220px] flex flex-col border border-gray-800 rounded-2xl bg-[#1a1a1c] p-4 text-center">
                    <div className="h-24 w-full bg-white rounded-lg mb-4 flex items-center justify-center mix-blend-multiply overflow-hidden">
                      <img src={product.image} alt={product.title} className="h-full object-contain" />
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-[#d946ef] cursor-pointer" title={product.title}>
                      {product.title}
                    </h3>
                    <div className="mt-auto text-[#d946ef] font-black text-lg">₹{product.price}</div>
                  </div>

                  {/* Specs Values */}
                  <div className="flex flex-col gap-6 py-4 text-sm mt-4">
                    {specsKeys.map(key => (
                      <div key={key} className="h-6 flex items-center text-gray-300 font-medium border-b border-gray-800/50 pb-2">
                        {key === 'AvailableColors' ? (
                          <div className="flex items-center gap-1">
                            <span className="text-white font-bold">{specs[key]}</span>
                            <span className="text-gray-500 text-xs">Colors</span>
                          </div>
                        ) : key === 'Rating' ? (
                           <div className="flex items-center gap-1">
                             <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                             <span>{specs[key]}</span>
                           </div>
                        ) : (
                          specs[key]
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add to Cart Footer */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <ShoppingCart className="w-4 h-4 fill-white" /> Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}
