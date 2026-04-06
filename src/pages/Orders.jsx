import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Package, ShoppingBag, Clock, AlertCircle } from 'lucide-react';
import { MOCK_ORDERS } from '../data/ordersData';
import OrderCard from '../components/Orders/OrderCard';
import RecommendationsSidebar from '../components/Orders/RecommendationsSidebar';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('Orders');
  const [timeFilter, setTimeFilter] = useState('past 3 months');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(MOCK_ORDERS);

  // Simulation of filtered fetching / local filtering
  useEffect(() => {
    let result = MOCK_ORDERS;

    // Filter by tab status
    if (activeTab === 'Not Yet Shipped') {
      result = result.filter(o => o.status === 'Not Yet Shipped');
    } else if (activeTab === 'Buy Again') {
       // Just showing all for mock, but logically would be different
    }

    // Filter by search query (Project title or Order ID)
    if (searchQuery) {
      result = result.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredOrders(result);
  }, [activeTab, searchQuery, timeFilter]);

  const tabs = ['Orders', 'Buy Again', 'Not Yet Shipped', 'Cancelled'];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 p-4 md:p-8 lg:px-16 lg:py-12">
      {/* Breadcrumbs / Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
           <span className="hover:text-pink-500 cursor-pointer transition-colors">Your Account</span>
           <span>›</span>
           <span className="text-pink-500">Your Orders</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Orders</span></h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content (70%) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs and Search Bar Overlay */}
          <div className="space-y-6">
            <div className="flex overflow-x-auto custom-scrollbar gap-8 border-b border-gray-800/50 pb-px">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-pink-500' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 animate-in fade-in slide-in-from-bottom-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
               <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                  <span className="whitespace-nowrap">{filteredOrders.length} orders placed in</span>
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#12121a] border border-gray-800 rounded-xl text-gray-200 hover:border-gray-600 transition-all text-xs font-black shadow-lg">
                       {timeFilter} <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Mock Dropdown */}
                    <div className="absolute left-0 top-full mt-2 w-48 bg-[#12121a] border border-gray-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-10">
                        {['past 3 months', '2025', '2024'].map(year => (
                           <button 
                            key={year}
                            onClick={() => setTimeFilter(year)}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                           >
                              {year}
                           </button>
                        ))}
                    </div>
                  </div>
               </div>

               {/* Search Bar */}
               <div className="relative w-full md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search all orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 pl-12 pr-4 bg-[#12121a] border border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all text-sm font-medium"
                  />
               </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
               filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
               ))
            ) : (
              <div className="bg-[#12121a] border border-gray-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6 shadow-xl">
                 <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border border-dashed border-gray-700">
                    <ShoppingBag className="w-10 h-10 text-gray-600" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white">No orders found</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm">We couldn't find any orders matching your criteria. Try adjusting your filters or search query.</p>
                 </div>
                 <button 
                  onClick={() => { setActiveTab('Orders'); setSearchQuery(''); setTimeFilter('past 3 months'); }}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-sm font-black text-white shadow-lg hover:opacity-90 transition-all"
                 >
                    Clear All Filters
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Recommendations (30%) */}
        <div className="lg:col-span-4 lg:pl-4">
           <RecommendationsSidebar />
           
           {/* Secondary Sidebar Widget */}
           <div className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-2xl p-6 mt-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                 <Clock className="w-5 h-5 text-purple-400" />
                 <h4 className="text-sm font-black text-white uppercase tracking-widest leading-none">History Spotlight</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium mb-4">
                 You ordered 4 items in the past 12 months. Your shopping activity is 12% higher than average.
              </p>
              <button className="text-[11px] font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest flex items-center gap-2">
                 View Activity Report <AlertCircle className="w-3 h-3" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
