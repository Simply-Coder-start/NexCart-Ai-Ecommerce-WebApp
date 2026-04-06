import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeftRight, X, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useCart();

  // Helper to get specs
  const getSpecs = (product) => {
    return {
      Category: product.category || 'N/A',
      Rating: `${product.rating || 'N/A'} (${product.reviews || 0} reviews)`,
      AvailableColors: product.colors ? product.colors.length : 'N/A',
      Sizes: 'S, M, L, XL', 
      Availability: 'In Stock',
      Shipping: 'Free Delivery',
    };
  };

  const specsKeys = ['Category', 'Rating', 'AvailableColors', 'Sizes', 'Availability', 'Shipping'];

  if (compareList.length === 0) {
    return (
      <main className="max-w-[1500px] w-full mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
           <ArrowLeftRight className="w-10 h-10 text-gray-600" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Comparison List is Empty</h1>
          <p className="text-gray-400 max-w-xs mx-auto">Add products from the shop to compare them side-by-side.</p>
        </div>
        <Link to="/shop" className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-opacity">
          Go to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1600px] w-full mx-auto px-4 md:px-8 pt-10 pb-24 flex flex-col flex-1">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-pink-500 mb-2">
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Feature Comparison</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Compare <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">Products</span>
          </h1>
        </div>
        
        <button 
          onClick={clearCompare}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-800 bg-[#131315] text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all font-semibold"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="bg-[#131315] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto p-8 custom-scrollbar">
          <div className="min-w-max flex gap-12">
            
            {/* Specs Labels Column */}
            <div className="w-48 shrink-0 flex flex-col pt-[260px]">
              <div className="flex flex-col gap-10 uppercase tracking-wider text-xs font-bold text-gray-500">
                {specsKeys.map(key => (
                  <div key={key} className="h-8 flex items-center border-b border-gray-800/30 pb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                ))}
              </div>
            </div>

            {/* Product Columns */}
            {compareList.map((product) => {
              const specs = getSpecs(product);
              return (
                <div key={product.id} className="w-72 shrink-0 flex flex-col relative group">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 opacity-100 hover:bg-red-500 hover:text-white transition-all z-20 shadow-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Product Header Card */}
                  <div className="h-[240px] flex flex-col border border-gray-800 rounded-2xl bg-[#1a1a20] p-5 shadow-inner">
                    <div className="h-32 w-full bg-white rounded-xl mb-4 flex items-center justify-center p-3 mix-blend-multiply overflow-hidden shadow-md">
                      <img src={product.image} alt={product.title} className="h-full object-contain" />
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 hover:text-pink-500 transition-colors h-10 mb-1">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="text-pink-500 font-extrabold text-xl">₹{product.price}</div>
                  </div>

                  {/* Spec Values */}
                  <div className="flex flex-col gap-10 py-4 text-sm mt-5">
                    {specsKeys.map(key => (
                      <div key={key} className="h-8 flex items-center text-gray-300 font-semibold border-b border-gray-800 pb-2">
                        {key === 'AvailableColors' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-white bg-gray-800 px-2 py-0.5 rounded text-xs">{specs[key]}</span>
                            <span className="text-gray-500 text-[10px] uppercase font-bold">Colors Available</span>
                          </div>
                        ) : key === 'Rating' ? (
                           <div className="flex items-center gap-1.5">
                             <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                             <span className="text-white">{specs[key]}</span>
                           </div>
                        ) : key === 'Availability' ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            {specs[key]}
                          </span>
                        ) : (
                          specs[key]
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              );
            })}

            {/* Add More Slot */}
            {compareList.length < 4 && (
               <Link 
                 to="/shop" 
                 className="w-72 shrink-0 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-pink-500/50 hover:bg-gray-800/20 transition-all text-gray-600 hover:text-gray-400 group"
               >
                 <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center group-hover:border-pink-500/50">
                    <Plus className="w-8 h-8" />
                 </div>
                 <span className="font-bold uppercase tracking-widest text-xs">Add more items</span>
               </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Minimal Plus icon as it's not imported from lucide-react yet
function Plus({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
}
