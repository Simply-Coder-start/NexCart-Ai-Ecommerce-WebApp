import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, MapPin, CheckCircle2, ChevronLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const steps = [
    { title: 'Order Placed', date: '31 March, 10:24 AM', status: 'completed', icon: Package },
    { title: 'Processed', date: '31 March, 02:45 PM', status: 'completed', icon: CheckCircle2 },
    { title: 'Shipped', date: '01 April, 09:12 AM', status: 'completed', icon: Truck },
    { title: 'Out for Delivery', date: '02 April, 08:30 AM', status: 'current', icon: MapPin },
    { title: 'Delivered', date: 'Expected by Evening', status: 'upcoming', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 p-4 md:p-12 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Orders</span>
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-pink-500 mb-2">
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Track Shipment</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">#{id}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Estimated Delivery: <span className="text-emerald-400 font-bold">Today, April 2nd</span></p>
        </header>

        {/* Timeline Container */}
        <div className="bg-[#12121a]/80 backdrop-blur-xl border border-gray-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px]"></div>
           
           <div className="space-y-0 relative">
             {/* Vertical Line */}
             <div className="absolute left-6 top-8 bottom-8 w-px bg-gray-800"></div>

             {steps.map((step, idx) => {
               const Icon = step.icon;
               const isCompleted = step.status === 'completed';
               const isCurrent = step.status === 'current';

               return (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="flex gap-10 pb-12 last:pb-0 relative"
                 >
                   {/* Marker */}
                   <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border ${
                     isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                     isCurrent ? 'bg-pink-500 text-white border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 
                     'bg-gray-900 text-gray-700 border-gray-800'
                   }`}>
                     <Icon className="w-6 h-6" />
                   </div>

                   {/* Content */}
                   <div className="flex flex-col justify-center">
                     <h3 className={`text-lg font-black tracking-tight transition-colors ${
                       isCompleted ? 'text-gray-300' : isCurrent ? 'text-white' : 'text-gray-600'
                     }`}>
                       {step.title}
                     </h3>
                     <p className={`text-xs font-bold transition-colors ${
                       isCompleted ? 'text-gray-500' : isCurrent ? 'text-pink-400' : 'text-gray-700'
                     }`}>
                       {step.date}
                     </p>
                   </div>
                 </motion.div>
               );
             })}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
           <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-all">
              <HelpCircle className="w-4 h-4" /> Need help with this shipment?
           </div>
           <button className="px-8 py-3 bg-white/5 border border-gray-800 rounded-full text-xs font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">
              Report Issue
           </button>
        </div>
      </div>
    </div>
  );
}
