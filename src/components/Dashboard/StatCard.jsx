import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, change, color }) {
  const isPositive = change.startsWith('+');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121a]/80 backdrop-blur-md border border-gray-800 p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group hover:border-gray-700/80 transition-all"
    >
      {/* Background Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <span className="text-gray-400 text-sm font-semibold tracking-wide">{label}</span>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      
      <div className="text-3xl font-black text-white tracking-tight relative z-10">
        {value}
      </div>
    </motion.div>
  );
}
