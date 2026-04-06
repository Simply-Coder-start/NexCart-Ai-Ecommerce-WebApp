import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, BarChart3, Clock } from 'lucide-react';
import { STOCK_PREDICTIONS } from '../../data/sellerData';

export default function StockPredictor() {
  return (
    <div className="bg-[#12121a]/80 backdrop-blur-md border border-gray-800 p-8 rounded-[38px] flex flex-col gap-6 h-full relative overflow-hidden group shadow-2xl">
      {/* Accent Glow */}
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-600/5 blur-[80px]"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">AI Stock Predictor</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inventory Velocity Analysis</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[10px] text-emerald-400 font-black flex items-center gap-1 uppercase tracking-tighter shadow-inner">
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div> Live
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
        {STOCK_PREDICTIONS.map((item) => {
          const daysLeft = Math.round(item.stock / item.velocity);
          const isLow = daysLeft <= 5;
          const percentage = Math.min((daysLeft / 15) * 100, 100);

          return (
            <motion.div 
              key={item.id}
              whileHover={{ x: 4 }}
              className="p-4 rounded-2xl bg-[#0a0a0c]/60 border border-gray-800/40 hover:bg-gray-800/20 hover:border-purple-500/30 transition-all flex flex-col gap-3 group relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-white/5 shadow-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-gray-500">Stock: {item.stock}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-700"></div>
                    <span className="text-[10px] font-bold text-gray-500">v: {item.velocity}/day</span>
                  </div>
                </div>
                <div className={`text-right ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                  <div className="text-sm font-black">{daysLeft} days</div>
                  <div className="text-[9px] font-bold uppercase tracking-tighter opacity-70">Until Stockout</div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full transition-colors ${
                    isLow ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  }`}
                />
              </div>

              {/* Alert Indicator */}
              {isLow && (
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                   <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button className="flex items-center justify-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors mt-auto uppercase tracking-widest pt-2 border-t border-gray-800/50">
        Bulk Restock Analysis <ArrowUpRight className="w-3 h-3" />
      </button>
    </div>
  );
}
