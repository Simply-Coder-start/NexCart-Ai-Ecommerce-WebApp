import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, CheckCircle2, XCircle, Star, Info
} from 'lucide-react';

const ORDERS = [
  {
    id: "171-6896671-9513962",
    placedDate: "29 March 2026",
    total: "304.00",
    shipTo: "Subham",
    status: "Delivered",
    statusDate: "31 March",
    statusMessage: "Package was handed to resident",
    isCancelled: false,
    items: [
      {
        name: "Boat BassHeads 100 in-Ear Headphones with Mic (Black)",
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=200&auto=format&fit=crop",
        returnStatus: "Replace item: Eligible till 10 April 2026"
      }
    ],
    primaryAction: "Get product support",
    secondaryActions: [
      "Track package", "Replace item", "Share gift receipt", 
      "Leave seller feedback", "Leave delivery feedback", "Write a product review"
    ]
  },
  {
    id: "402-3094723-4477932",
    placedDate: "29 March 2026",
    total: "304.00",
    shipTo: "Subham",
    status: "Cancelled",
    statusMessage: "If you were charged, a refund will be processed and credited to the original payment method within next 3-5 business days",
    isCancelled: true,
    items: [
      {
        name: "Boat BassHeads 100 in-Ear Headphones with Mic (Black)",
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=200&auto=format&fit=crop",
        returnStatus: null
      }
    ]
  },
  {
    id: "402-0862950-7246718",
    placedDate: "29 March 2026",
    total: "304.00",
    shipTo: "Subham",
    status: "Cancelled",
    statusMessage: "If you were charged, a refund will be processed and credited to the original payment method within next 3-5 business days",
    isCancelled: true,
    items: [
      {
        name: "Boat BassHeads 100 in-Ear Headphones with Mic (Black)",
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=200&auto=format&fit=crop",
        returnStatus: null
      }
    ]
  }
];

const RECOMMENDATIONS = [
  {
    title: "Wipro 16A Wi-Fi Smart Plug with Energy...",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200&auto=format&fit=crop",
    discount: "-56%",
    price: "999",
    mrp: "2,290.00",
    deliveryDate: "Thursday, April 9",
    buttonType: "cart"
  },
  {
    title: "wipro 9-Watt B22 WiFi Smart LED Bulb with Mu...",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop",
    discount: "-71%",
    price: "603",
    mrp: "2,099.00",
    deliveryDate: "Saturday, April 11",
    buttonType: "cart"
  },
  {
    title: "Mi Air Purifier 3 with True HEPA Filter, removes air pollutants, smoke, odor,...",
    image: "https://images.unsplash.com/photo-1626082928503-6e11802187f5?q=80&w=200&auto=format&fit=crop",
    price: "9,999",
    buttonType: "options"
  },
  {
    title: "Yale Smart Lock Pro & Connect- Alexa Enabled Smart Door Lock with Ap...",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200&auto=format&fit=crop",
    price: "24,999",
    buttonType: "options"
  }
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('Orders');

  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 md:px-8 pt-6 pb-20">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="text-[#a855f7] hover:text-[#d946ef] cursor-pointer transition-colors">Your Account</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-[#a855f7] hover:text-[#d946ef] cursor-pointer transition-colors">Your Orders</span>
      </div>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Orders</h1>
        
        <div className="flex items-center w-full md:w-[450px]">
          <div className="flex items-center flex-1 h-11 bg-[#131315] rounded-l-xl border border-gray-700 overflow-hidden pl-3 focus-within:border-[#a855f7] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search all orders" 
              className="bg-transparent border-none outline-none px-3 text-sm w-full text-white placeholder-gray-500"
            />
          </div>
          <button className="h-11 px-6 rounded-r-xl bg-[#202022] border-y border-r border-gray-700 hover:bg-gray-800 transition-colors text-sm font-semibold text-white">
            Search Orders
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-800 mb-6 overflow-x-auto no-scrollbar">
        {['Orders', 'Buy Again', 'Not Yet Shipped'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab 
              ? 'text-[#d946ef] border-b-2 border-[#d946ef]' 
              : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-white">4 orders</span>
        <span className="text-sm text-gray-400">placed in</span>
        <button className="bg-[#131315] border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-1.5 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
          past 3 months <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Layout: Orders List + Recommendations Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        
        {/* Left Column: Orders List */}
        <div className="flex flex-col gap-6">
          {ORDERS.map((order, idx) => (
            <div key={idx} className="bg-[#131315] rounded-2xl border border-gray-800/80 overflow-hidden shadow-lg shadow-black/20">
              
              {/* Order Header */}
              <div className="bg-[#1a1a1c] border-b border-gray-800 p-4 flex flex-wrap justify-between items-start gap-4">
                
                {/* Left Side Header Info */}
                <div className="flex gap-8 md:gap-16">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Order Placed</span>
                    <span className="text-sm text-gray-300">{order.placedDate}</span>
                  </div>
                  {!order.isCancelled && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total</span>
                      <span className="text-sm text-gray-300">₹{order.total}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Ship To</span>
                    <button className="text-sm text-[#a855f7] hover:text-[#d946ef] flex items-center gap-1 transition-colors">
                      {order.shipTo} <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Side Header Info */}
                <div className="flex flex-col items-end">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Order # {order.id}</div>
                  <div className="flex gap-3 text-sm">
                    <button className="text-[#a855f7] hover:text-[#d946ef] transition-colors">View order details</button>
                    <span className="text-gray-700">|</span>
                    <button className="text-[#a855f7] hover:text-[#d946ef] flex items-center gap-1 transition-colors">
                      Invoice <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6">
                
                {/* Item Details */}
                <div className="flex-1">
                  <div className="mb-4">
                    {order.isCancelled ? (
                      <>
                        <h2 className="text-xl font-bold text-red-400 mb-1 flex items-center gap-2">
                          <XCircle className="w-5 h-5" /> Cancelled
                        </h2>
                        <p className="text-sm text-gray-400">{order.statusMessage}</p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold text-white mb-1">
                          {order.status} {order.statusDate}
                        </h2>
                        <p className="text-sm text-gray-400">{order.statusMessage}</p>
                      </>
                    )}
                  </div>

                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-20 h-20 bg-white rounded-lg p-1 flex-shrink-0">
                        <img src={item.image} alt="Product" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <a href="#" className="text-[#a855f7] hover:text-[#d946ef] text-sm font-medium line-clamp-2 transition-colors">
                          {item.name}
                        </a>
                        {item.returnStatus && (
                          <span className="text-xs text-gray-400">{item.returnStatus}</span>
                        )}
                        <button className="mt-2 w-fit px-4 py-1.5 rounded-full border border-gray-700 bg-[#1a1a1c] hover:bg-gray-800 text-xs font-semibold text-gray-300 transition-colors">
                          View your item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions Sidebar (Only for non-cancelled) */}
                {!order.isCancelled && (
                  <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-semibold text-sm text-white hover:opacity-90 transition-opacity shadow-lg shadow-pink-900/20">
                      {order.primaryAction}
                    </button>
                    {order.secondaryActions.map((action, i) => (
                      <button key={i} className="w-full py-2 rounded-xl bg-[#1a1a1c] border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-colors">
                        {action}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Recommendations Sidebar */}
        <aside className="h-fit rounded-2xl border border-gray-800/80 bg-[#131315] overflow-hidden">
          <div className="p-5 border-b border-gray-800 bg-[#1a1a1c]">
            <h3 className="text-lg font-bold text-white leading-tight">Top Smart Home Products For You</h3>
          </div>
          
          <div className="p-2">
            {RECOMMENDATIONS.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 hover:bg-[#1a1a1c] rounded-xl transition-colors group">
                <div className="w-20 h-20 bg-white rounded-lg p-2 flex-shrink-0 border border-gray-800">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex flex-col flex-1">
                  <a href="#" className="text-sm font-medium text-[#a855f7] hover:text-[#d946ef] line-clamp-2 leading-snug mb-1 transition-colors">
                    {item.title}
                  </a>
                  
                  <div className="flex items-center gap-2 mb-0.5">
                    {item.discount && (
                      <span className="text-xs font-bold text-[#ec4899]">{item.discount}</span>
                    )}
                    <span className="text-sm font-bold text-white flex items-start">
                      <span className="text-[10px] mt-0.5">₹</span>{item.price}
                      <span className="text-[10px] mt-0.5 text-gray-400">00</span>
                    </span>
                  </div>
                  
                  {item.mrp && (
                    <div className="text-[10px] text-gray-500 line-through">
                      M.R.P: ₹{item.mrp}
                    </div>
                  )}
                  
                  {item.deliveryDate && (
                    <div className="text-xs text-gray-400 mt-1">
                      Get it by <span className="font-bold text-gray-300">{item.deliveryDate}</span>
                    </div>
                  )}
                  
                  <div className="text-[10px] text-gray-500 mb-2">FREE Delivery by NexCart</div>
                  
                  {item.buttonType === 'cart' ? (
                    <button className="w-fit px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d946ef] to-[#db2777] text-xs font-bold text-white hover:opacity-90 transition-opacity">
                      Add to cart
                    </button>
                  ) : (
                    <button className="w-fit px-3 py-1.5 rounded-full border border-gray-700 bg-[#1a1a1c] hover:bg-gray-800 text-xs font-medium text-gray-300 transition-colors">
                      See all buying options
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </main>
  );
}
