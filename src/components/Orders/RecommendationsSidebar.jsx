import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { MOCK_RECOMMENDATIONS } from '../../data/ordersData';

export default function RecommendationsSidebar() {
  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-2xl p-6 shadow-xl sticky top-24">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-gray-800 pb-4">
        Top Smart Home <span className="text-pink-500">For You</span>
      </h3>
      
      <div className="flex flex-col gap-8">
        {MOCK_RECOMMENDATIONS.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative group-hover:border-pink-500/30 transition-all duration-300">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover p-1 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-0 right-0 bg-pink-500 text-[9px] font-black text-white px-1.5 py-0.5 rounded-bl-lg shadow-lg">
                  -{product.discount}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-300 line-clamp-2 leading-snug group-hover:text-pink-400 transition-colors">
                  {product.title}
                </h4>
                <div className="flex items-center gap-1 mt-1 text-emerald-400">
                  <Star className="w-3 h-3 fill-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Recommended</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                   <span className="text-sm font-black text-white">{product.price}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 rounded-xl bg-[#0a0a0c] border border-gray-800 hover:bg-pink-500 hover:border-pink-500 text-[10px] font-black text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-inner group/btn">
              <ShoppingCart className="w-3.5 h-3.5 text-gray-500 group-hover/btn:text-white" /> Add to cart
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
         <button className="text-[10px] font-black text-gray-500 hover:text-purple-400 transition-colors uppercase tracking-[0.2em] underline underline-offset-4">
            See all recommendations
         </button>
      </div>
    </div>
  );
}
