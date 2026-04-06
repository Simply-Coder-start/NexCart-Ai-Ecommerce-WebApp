import React, { useState } from 'react';
import { ChevronDown, Package, HelpCircle, RefreshCcw, Star, FileText, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const [loadingItems, setLoadingItems] = useState({});

  const handleBuyAgain = async (product) => {
    setLoadingItems(prev => ({ ...prev, [product.id]: true }));
    try {
      // Direct call to cart/add
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1,
        color: 'Standard', // Defaulting for simple re-buy
      });
      
      // Success: Show toast or just navigate
      // We'll navigate to cart as requested
      navigate('/cart');
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not re-add to cart. Please try the product page.");
    } finally {
      setLoadingItems(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // Helper to check if return window is open (30 days policy)
  const isReturnWindowOpen = (orderDateStr) => {
    const orderDate = new Date(orderDateStr);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate > thirtyDaysAgo;
  };

  const returnOpen = isReturnWindowOpen(order.date);

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-2xl overflow-hidden mb-6 shadow-xl transition-all hover:border-gray-700/50 group">
      {/* Order Header */}
      <div className="bg-gray-900/60 p-4 sm:p-6 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-8 text-xs font-medium uppercase tracking-widest">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Order Placed</span>
            <span className="text-gray-300">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Total</span>
            <span className="text-gray-300 font-bold">{order.total}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Ship To</span>
            <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
              User Name <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 uppercase tracking-widest">Order #</span>
            <span className="text-gray-300">{order.id}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 underline-offset-4">
            <button onClick={() => navigate(`/order-details/${order.id}`)} className="text-purple-400 hover:text-purple-300 underline">View order details</button>
            <span className="text-gray-800">|</span>
            <div className="relative group/invoice">
                <button className="text-purple-400 hover:text-purple-300 underline flex items-center gap-1">
                  Invoice <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#12121a] border border-gray-800 rounded-xl shadow-2xl p-2 hidden group-hover/invoice:block z-20">
                   <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-all">
                      <FileText className="w-4 h-4 text-gray-500" /> Download PDF
                   </button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Body */}
      <div className="p-6">
        <h3 className="text-xl font-black text-white mb-6">
          {order.status === 'Delivered' ? `Delivered ${order.deliveryDate}` : order.deliveryDate}
        </h3>

        {order.items.map((item, idx) => (
          <div key={item.id} className={`flex flex-col md:flex-row gap-6 ${idx !== 0 ? 'mt-8 pt-8 border-t border-gray-800/50' : ''}`}>
            {/* Product Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-inner group-hover:border-purple-500/30 transition-all duration-300">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover p-1 hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col gap-1">
              <button 
                onClick={() => navigate(`/product/${item.id}`)}
                className="text-purple-400 font-bold hover:text-purple-300 hover:underline transition-all text-left line-clamp-2 leading-snug"
              >
                {item.title}
              </button>
              <p className="text-sm text-gray-400 font-medium mt-1">{item.returnWindow}</p>
              <div className="mt-4 flex gap-3">
                 <button 
                  onClick={() => handleBuyAgain(item)}
                  disabled={loadingItems[item.id]}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-black text-white shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-50"
                 >
                    {loadingItems[item.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Buy it again'}
                 </button>
                 <button 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="px-4 py-2 bg-[#0a0a0c] border border-gray-800 hover:bg-gray-800 rounded-full text-xs font-black text-white transition-all"
                 >
                    View your item
                 </button>
              </div>
            </div>

            {/* Action Buttons Column */}
            <div className="flex flex-col gap-2 w-full md:w-56 mt-4 md:mt-0">
               <button 
                onClick={() => navigate(`/track-order/${order.id}`)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
               >
                 <Package className="w-4 h-4" />
                 {order.status === 'Delivered' ? 'Track package' : 'Tracking in progress'}
               </button>
               
               <button 
                onClick={() => returnOpen && navigate(`/return-item/${order.id}/${item.id}`)}
                disabled={!returnOpen}
                className={`w-full py-2.5 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    returnOpen 
                    ? 'border-gray-800 text-gray-200 hover:bg-gray-800' 
                    : 'border-gray-900 text-gray-600 cursor-not-allowed bg-gray-900/20'
                }`}
               >
                 <RefreshCcw className="w-4 h-4 text-gray-500" /> 
                 {returnOpen ? 'Return or replace items' : 'Return window closed'}
               </button>
               
               <button 
                onClick={() => navigate(`/review-product/${item.id}`)}
                className="w-full py-2.5 rounded-xl border border-gray-800 text-gray-200 font-bold text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
               >
                 <Star className="w-4 h-4 text-emerald-500" /> Write a product review
               </button>

               <button 
                onClick={() => navigate(`/support?product=${item.id}&order=${order.id}`)}
                className="w-full py-2.5 rounded-xl border border-gray-800 text-gray-200 font-bold text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
               >
                 <HelpCircle className="w-4 h-4 text-purple-500" /> Get product support
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
