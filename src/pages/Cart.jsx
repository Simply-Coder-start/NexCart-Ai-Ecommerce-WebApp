import React, { useState } from 'react';
import { 
  Trash2, Heart, Share2, Info, CheckCircle2, AlertTriangle, ShieldCheck,
  ChevronRight, Minus, Plus
} from 'lucide-react';

const CART_ITEMS = [
  {
    id: 1,
    title: "Beardo Whisky Smoke Perfume for Men,50ml|Spicy,Woody-Oudh Scent Eau De Parfum|Long Lasting Mens Perfume|Best Date Night Fragrance Body Spray|Valentin...",
    image: "https://images.unsplash.com/photo-1594035910387-fea47714263f?q=80&w=300&auto=format&fit=crop",
    price: 251.00,
    mrp: null,
    pricePerUnit: "(₹5.02 / millilitre)",
    inStock: true,
    deliveryDate: "Thu, 9 Apr",
    isFulfilled: true,
    isGift: false,
    size: "50 ml (Pack of 1)",
    quantity: 1,
    savings: "Save 5 % more with Subscribe & Save",
    cashback: "Up to 5% back with NexCart Pay",
    cardInfo: "ICICI card Terms"
  },
  {
    id: 2,
    title: "Wild Stone Edge Edp Premium Perfume For Men,100 Ml|Long-Lasting Eau De Parfum|Luxury Fragrances|Fragrance For Modern Lifestyle|Ideal Gift For Him|Premiu...",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=300&auto=format&fit=crop",
    price: 293.00,
    mrp: null,
    pricePerUnit: "(₹2.93 / millilitre)",
    inStock: true,
    deliveryDate: "Thu, 9 Apr",
    isFulfilled: true,
    isGift: false,
    size: "100 ml (Pack of 1)",
    quantity: 1,
    savings: null,
    cashback: "Up to 5% back with NexCart Pay",
    cardInfo: "ICICI card Terms"
  }
];

export default function Cart() {
  const [items, setItems] = useState(CART_ITEMS);
  const [selectedItems, setSelectedItems] = useState([1, 2]); // IDs of checked items
  const [isGiftChecked, setIsGiftChecked] = useState(false);

  const subtotal = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const selectedCount = selectedItems.length;

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const deselectAll = () => setSelectedItems([]);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  return (
    <main className="max-w-[1500px] w-full mx-auto px-4 md:px-8 pt-6 pb-20 flex flex-col gap-6">
      
      {/* Top Banner (NexCart Fresh Equivalent) */}
      <div className="bg-[#131315] border border-emerald-900/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg relative overflow-hidden">
        {/* Subtle green glow to match the "Fresh" vibe but keep it dark */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        
        <div className="flex-1 flex flex-col gap-4 w-full">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Delivery from <span className="text-emerald-400">NexCart Fresh</span>
          </h2>
          <div className="flex items-center gap-4 p-4 bg-[#1a1a1c] rounded-xl border border-gray-800 w-full md:w-3/4">
             {/* Mock Thumbnails */}
             <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1"><img src="https://images.unsplash.com/photo-1594035910387-fea47714263f?q=80&w=100&auto=format&fit=crop" className="mix-blend-multiply object-contain h-full" alt="item"/></div>
             <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1"><img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=100&auto=format&fit=crop" className="mix-blend-multiply object-contain h-full" alt="item"/></div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto min-w-[300px]">
           <div className="flex flex-col items-end text-sm">
              <span className="text-gray-300 font-medium">Subtotal (0 items):</span>
              <span className="text-amber-500 flex items-center gap-1 mt-1 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> 2 items are unavailable. <a href="#" className="text-[#a855f7] hover:underline ml-1">Review</a>
              </span>
           </div>
           <button className="w-full py-2 rounded-xl bg-transparent border border-gray-600 hover:border-gray-400 text-sm font-semibold transition-colors">
             Go to Fresh Cart
           </button>
           <div className="text-xs text-gray-400 flex flex-col items-end gap-1">
             <span>Delivery to <span className="text-white font-bold">Subham- DURLLABHGANJ</span></span>
             <a href="#" className="text-[#a855f7] hover:underline">Continue shopping on Fresh</a>
           </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        {/* Left Column (Main Cart List) */}
        <div className="flex flex-col gap-6">
          
          {/* Shopping Cart Card */}
          <div className="bg-[#131315] rounded-2xl border border-gray-800/80 overflow-hidden shadow-xl shadow-black/20">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <h1 className="text-3xl font-extrabold text-white">Shopping Cart</h1>
                <span className="text-sm text-gray-500 font-medium">Price</span>
              </div>
              {selectedCount > 0 && (
                <button onClick={deselectAll} className="text-[#a855f7] hover:text-[#d946ef] text-sm font-medium w-fit transition-colors">
                  Deselect all items
                </button>
              )}
            </div>

            {/* Items List */}
            <div className="flex flex-col">
              {items.map((item, idx) => (
                <div key={item.id} className={`p-6 flex gap-4 md:gap-6 relative ${idx !== items.length - 1 ? 'border-b border-gray-800' : ''}`}>
                  
                  {/* Custom Checkbox */}
                  <div className="pt-2 flex-shrink-0">
                     <label className="relative flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="sr-only peer"
                         checked={selectedItems.includes(item.id)}
                         onChange={() => toggleSelection(item.id)}
                       />
                       <div className="w-5 h-5 rounded bg-gray-800 border border-gray-600 peer-checked:bg-[#d946ef] peer-checked:border-[#d946ef] flex items-center justify-center transition-all">
                          {selectedItems.includes(item.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                       </div>
                     </label>
                  </div>

                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl p-2 flex-shrink-0 border border-gray-800 relative cursor-pointer">
                    <img src={item.image} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>

                  {/* Details Column */}
                  <div className="flex-1 flex flex-col gap-1.5">
                     <a href="#" className="text-base md:text-lg font-medium text-gray-200 hover:text-[#d946ef] line-clamp-2 leading-snug transition-colors">
                       {item.title}
                     </a>
                     
                     <div className="text-sm font-bold text-emerald-400 mt-1">In stock</div>
                     
                     <div className="text-xs text-gray-400">
                       FREE delivery <span className="font-bold text-gray-200">{item.deliveryDate}</span>
                     </div>
                     
                     {item.isFulfilled && (
                       <div className="flex items-center gap-1 mt-0.5">
                         <span className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[10px] font-bold text-gray-300 flex items-center gap-1 w-fit">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hexagon w-3 h-3 fill-gray-400 text-gray-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Fulfilled
                         </span>
                       </div>
                     )}

                     <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit group">
                       <div className="w-4 h-4 rounded-sm border border-gray-600 bg-transparent flex items-center justify-center group-hover:border-gray-400">
                         {/* Intentionally left unchecked like in photo, but can add logic if needed */}
                       </div>
                       <span className="text-xs text-gray-300">This will be a gift</span>
                       <a href="#" className="text-xs text-[#a855f7] hover:underline ml-1">Learn more</a>
                     </label>

                     <div className="text-xs text-gray-300 mt-1">
                       <span className="font-bold">Size:</span> {item.size}
                     </div>

                     {/* Action Row */}
                     <div className="flex flex-wrap items-center gap-4 mt-3">
                       {/* Qty Stepper */}
                       <div className="flex items-center h-8 rounded-lg border border-gray-700 bg-[#1a1a1c] overflow-hidden">
                         <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 h-full hover:bg-gray-800 text-gray-400 flex items-center justify-center">
                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                         </button>
                         <div className="px-3 h-full flex items-center justify-center text-sm font-bold border-x border-gray-700 bg-[#131315]">
                           {item.quantity}
                         </div>
                         <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 h-full hover:bg-gray-800 text-gray-400 flex items-center justify-center">
                            <Plus className="w-3.5 h-3.5" />
                         </button>
                       </div>

                       <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
                       <button className="text-xs text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">Delete</button>
                       <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
                       <button className="text-xs text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">Save for later</button>
                       <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
                       <button className="text-xs text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">See more like this</button>
                       <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
                       <button className="text-xs text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">Share</button>
                     </div>
                  </div>

                  {/* Price Column (Right Aligned) */}
                  <div className="flex flex-col items-end min-w-[120px] ml-auto">
                    <div className="text-lg font-bold text-white flex items-start">
                       <span className="text-[12px] mt-1 font-normal">₹</span>{item.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">{item.pricePerUnit}</div>
                    
                    {item.savings && (
                       <div className="text-xs text-emerald-400 text-right mt-2 flex flex-col items-end leading-tight">
                         <span>{item.savings.split('with')[0]} with</span>
                         <a href="#" className="flex items-center gap-0.5 hover:underline text-emerald-300">
                           Subscribe & Save <ChevronRight className="w-3 h-3" />
                         </a>
                       </div>
                    )}

                    <div className="text-[10px] text-gray-400 mt-3 text-right">
                      {item.cashback}<br/>
                      <a href="#" className="text-[#a855f7] hover:underline">{item.cardInfo}</a>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Footer Subtotal */}
            <div className="p-6 bg-[#1a1a1c] border-t border-gray-800 flex justify-end">
              <div className="text-lg text-white">
                Subtotal ({selectedCount} items): <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Your Items Bottom Card */}
          <div className="bg-[#131315] rounded-2xl border border-gray-800/80 p-6 shadow-xl">
             <h2 className="text-2xl font-bold text-white mb-4">Your Items</h2>
             
             {/* Tabs */}
             <div className="flex gap-6 border-b border-gray-800 mb-6">
               <button className="pb-3 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">
                 No items saved for later
               </button>
               <button className="pb-3 text-sm font-bold text-[#d946ef] border-b-2 border-[#d946ef] transition-colors">
                 Buy it again
               </button>
             </div>

             {/* Empty State Box */}
             <div className="w-full rounded-xl border border-gray-700 bg-[#1a1a1c] p-4 text-sm text-gray-400">
               No items
             </div>
          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed mt-2 px-2">
            The price and availability of items at NexCart.in are subject to change. The shopping cart is a temporary place to store a list of your items and reflects each item's most recent price.<br/>
            Do you have a gift card or promotional code? We'll ask you to enter your claim code when it's time to pay.
          </p>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-6">
          
          {/* Checkout Card */}
          <div className="bg-[#131315] rounded-2xl border border-gray-800/80 p-5 shadow-xl shadow-black/40">
            
            {/* Progress Bar Area */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                Your order is eligible for FREE Delivery.
              </div>
              <div className="text-[10px] text-gray-400 ml-6 mb-3">
                Choose <span className="text-[#a855f7] hover:underline cursor-pointer">FREE Delivery</span> option at checkout.
              </div>
              
              {/* Fake Progress Bar to match the visual */}
              <div className="flex items-center gap-2">
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                </div>
                <span className="text-xs text-gray-400">₹499</span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-lg text-white mb-3">
              Subtotal ({selectedCount} items): <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Gift Checkbox */}
            <label className="flex items-center gap-2 mb-5 cursor-pointer group">
               <input 
                 type="checkbox" 
                 checked={isGiftChecked}
                 onChange={() => setIsGiftChecked(!isGiftChecked)}
                 className="w-4 h-4 rounded bg-gray-800 border-gray-600 accent-[#d946ef] cursor-pointer"
               />
               <span className="text-sm text-gray-300 group-hover:text-white transition-colors">This order contains a gift</span>
            </label>

            {/* Primary Action Button */}
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-bold text-white shadow-lg shadow-pink-900/20 hover:opacity-90 transition-opacity">
              Proceed to Buy
            </button>
          </div>

          {/* Promo Card (Prime Alternative) */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1e1b4b] to-[#4c1d95] border border-indigo-500/30 shadow-xl overflow-hidden relative">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-32 h-32 bg-[#d946ef]/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                Enjoy unlimited FREE & fast delivery and make shopping effortless. Stream movies & shows anytime with NexCart Premium.
              </h3>
              <p className="text-white font-extrabold text-sm mb-5 tracking-wide">
                Get 30 days of Premium for ₹299 FREE
              </p>
              
              <button className="w-full py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-gray-100 transition-colors">
                Start your 30-day FREE trial
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
