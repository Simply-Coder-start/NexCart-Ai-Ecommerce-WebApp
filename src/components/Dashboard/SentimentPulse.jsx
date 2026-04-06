import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { SENTIMENT_DATA } from '../../data/sellerData';

export default function SentimentPulse() {
  return (
    <div className="bg-[#12121a]/80 backdrop-blur-md border border-gray-800 p-8 rounded-[40px] flex flex-col gap-6 h-full relative overflow-hidden group shadow-xl">
      {/* Background Pulse Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-colors duration-1000"></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Sentiment Pulse</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time Feedback Analysis</p>
          </div>
        </div>
        <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#12121a] bg-gray-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#12121a] bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">+12</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-2 relative z-10">
        {SENTIMENT_DATA.map((item, index) => {
          const isPositive = item.mood === 'positive';
          const isNegative = item.mood === 'negative';
          
          return (
            <motion.div 
              key={item.word}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`px-5 py-2.5 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all cursor-default ${
                isPositive 
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : isNegative 
                    ? 'border-red-500/30 bg-red-500/5 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'border-gray-800 bg-[#0a0a0c] text-gray-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : isNegative ? <TrendingDown className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5 opacity-50" />}
              {item.word}
              <span className="text-[10px] opacity-40 font-black">×{item.count}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800/50 flex items-center justify-between relative z-10">
         <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Overall Score</span>
            <span className="text-2xl font-black text-white">8.4<span className="text-emerald-400 text-sm ml-1">+0.2</span></span>
         </div>
         <div className="w-32 h-10 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-center">
            {/* Minimal glowing line chart mock */}
            <div className="flex items-end gap-1 h-4">
                {[4,6,3,8,5,7,9,6,8].map((h, i) => (
                    <div key={i} className={`w-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] h-${h}`} style={{ height: `${h * 2}px` }}></div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
}
