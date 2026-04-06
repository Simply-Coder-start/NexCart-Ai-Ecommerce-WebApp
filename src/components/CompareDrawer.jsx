import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeftRight, X, ChevronUp, ChevronDown } from 'lucide-react';
import CompareModal from './CompareModal';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCart();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-3xl transition-transform duration-500 ease-in-out ${isMinimized ? 'translate-y-[calc(100%-40px)]' : 'translate-y-0'}`}>
        <div className="bg-[#131315]/95 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 flex flex-col">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-gray-800/60 pb-3 mb-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <ArrowLeftRight className="w-4 h-4 text-[#d946ef]" />
              Compare Products ({compareList.length}/4)
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Product Thumbnails Slot */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar">
            <div className="flex flex-1 gap-4 items-center">
              {[0, 1, 2, 3].map((index) => {
                const item = compareList[index];
                return (
                  <div key={index} className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl border border-gray-800 bg-[#1a1a1c] flex flex-col relative shrink-0">
                    {item ? (
                      <>
                        <button 
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors z-10 border border-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="h-2/3 bg-white rounded-t-lg flex items-center justify-center p-1 mix-blend-multiply overflow-hidden">
                          <img src={item.image} alt={item.title} className="h-full object-contain" />
                        </div>
                        <div className="flex-1 p-1 flex items-center justify-center text-[10px] font-bold text-gray-300 text-center leading-tight truncate px-2">
                           ₹{item.price}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center flex-col gap-1 text-gray-600 opacity-50">
                         <div className="w-6 h-6 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">+</div>
                         <span className="text-[10px] font-medium uppercase tracking-wider">Empty</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0 border-l border-gray-800 pl-4 py-2">
               <button 
                 onClick={() => setShowModal(true)}
                 disabled={compareList.length < 2}
                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
               >
                 Compare Now
               </button>
               <button 
                 onClick={clearCompare}
                 className="text-xs font-semibold text-gray-500 hover:text-red-400 transition-colors"
               >
                 Clear all
               </button>
            </div>
          </div>

        </div>
      </div>

      {showModal && <CompareModal onClose={() => setShowModal(false)} />}
    </>
  );
}
