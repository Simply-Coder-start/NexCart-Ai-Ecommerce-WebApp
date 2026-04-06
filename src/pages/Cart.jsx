import React, { useState, useEffect } from 'react';
import { 
  Trash2, Heart, Share2, Info, CheckCircle2, ShieldCheck,
  Minus, Plus, ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [selectedItems, setSelectedItems] = useState([]); // IDs of checked items
  
  // Sync selected items with cart content
  useEffect(() => {
    setSelectedItems(cart.map(item => item.id));
  }, [cart.length]);

  const subtotal = cart
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  
  const selectedCount = selectedItems.length;

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-[1500px] w-full mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
           <ShoppingBag className="w-10 h-10 text-gray-600" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Your NexCart cart is empty</h1>
          <p className="text-gray-400 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet. Discover something new today!</p>
        </div>
        <Link to="/shop" className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-opacity">
          Explore products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1500px] w-full mx-auto px-4 md:px-8 pt-6 pb-20 flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="bg-[#131315] border border-emerald-900/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        
        <div className="flex-1 flex flex-col gap-4 w-full">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Delivery from <span className="text-emerald-400">NexCart Prime</span>
          </h2>
          <div className="flex items-center gap-4 p-4 bg-[#1a1a1c] rounded-xl border border-gray-800 w-full md:w-3/4">
             {cart.slice(0, 3).map((item, idx) => (
               <div key={idx} className="w-12 h-12 bg-white rounded flex items-center justify-center p-1 border border-gray-700">
                 <img src={item.image} className="mix-blend-multiply object-contain h-full" alt="preview"/>
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto min-w-[300px]">
           <div className="flex flex-col items-end text-sm">
              <span className="text-gray-300 font-medium">Subtotal ({selectedCount} items):</span>
              <span className="text-white font-bold text-xl">₹{subtotal.toFixed(2)}</span>
           </div>
           <Link to="/checkout" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center">
             Proceed to checkout
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        <div className="flex flex-col gap-6">
          <div className="bg-[#131315] rounded-2xl border border-gray-800/80 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-end">
              <h1 className="text-3xl font-extrabold text-white">Shopping Cart</h1>
              <span className="text-sm text-gray-500 font-medium">Price</span>
            </div>

            <div className="flex flex-col">
              {cart.map((item, idx) => (
                <div key={item.id} className={`p-6 flex gap-4 md:gap-6 relative ${idx !== cart.length - 1 ? 'border-b border-gray-800' : ''}`}>
                  
                  <div className="pt-2 flex-shrink-0">
                     <label className="relative flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="sr-only peer"
                         checked={selectedItems.includes(item.id)}
                         onChange={() => toggleSelection(item.id)}
                       />
                       <div className="w-5 h-5 rounded bg-gray-800 border border-gray-600 peer-checked:bg-pink-500 peer-checked:border-pink-500 flex items-center justify-center transition-all">
                          {selectedItems.includes(item.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                       </div>
                     </label>
                  </div>

                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl p-2 flex-shrink-0 border border-gray-800 relative">
                    <img src={item.image} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5">
                     <h3 className="text-base md:text-lg font-medium text-gray-200 line-clamp-2 leading-snug">
                       {item.title}
                     </h3>
                     
                     <div className="text-sm font-bold text-emerald-400 mt-1">In stock</div>
                     
                     <div className="text-[11px] text-gray-300 mt-1">
                        <span className="font-bold text-gray-500 mr-2 uppercase tracking-tighter">Color:</span>
                        <span className="px-2 py-0.5 rounded-full border border-gray-700 bg-[#1a1a1c] text-pink-400 font-bold">{item.color || 'Default'}</span>
                     </div>

                     <div className="flex flex-wrap items-center gap-4 mt-3">
                       <div className="flex items-center h-8 rounded-lg border border-gray-700 bg-[#1a1a1c] overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="px-2 h-full hover:bg-gray-800 text-gray-400 flex items-center justify-center"
                          >
                             {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                          </button>
                          <div className="px-3 h-full flex items-center justify-center text-sm font-bold border-x border-gray-700 bg-[#131315]">
                            {item.quantity}
                          </div>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="px-2 h-full hover:bg-gray-800 text-gray-400 flex items-center justify-center"
                          >
                             <Plus className="w-3.5 h-3.5" />
                          </button>
                       </div>

                       <div className="w-px h-4 bg-gray-700"></div>
                       <button 
                         onClick={() => removeFromCart(item.id)}
                         className="text-xs text-pink-500 hover:text-pink-400 font-medium transition-colors"
                        >
                          Delete
                        </button>
                       <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
                       <button className="text-xs text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">Save for later</button>
                       <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
                       <button className="text-xs text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">Share</button>
                     </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[100px] ml-auto">
                    <div className="text-lg font-bold text-white flex items-start">
                       <span className="text-[12px] mt-1 font-normal">₹</span>{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[#1a1a1c] border-t border-gray-800 flex justify-end">
              <div className="text-lg text-white">
                Subtotal ({selectedCount} items): <span className="font-bold text-2xl text-pink-500 ml-2">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[#131315] rounded-2xl border border-gray-800/80 p-5 shadow-xl shadow-black/40">
            <div className="flex items-center gap-2 mb-4 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
              Your order is eligible for FREE Delivery.
            </div>
            
            <div className="text-lg text-white mb-3">
              Subtotal ({selectedCount} items): <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-white shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center">
              Proceed to Buy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
