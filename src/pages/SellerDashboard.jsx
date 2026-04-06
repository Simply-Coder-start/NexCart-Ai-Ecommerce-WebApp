import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, LayoutDashboard, ShoppingBag, Truck, Users, 
  ArrowUpRight, Mail, Bell, Search, Settings as SettingsIcon,
  Loader2, ClipboardList, CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { SELLER_STATS, REVENUE_CHART_DATA, ORDER_PIPELINE } from '../data/sellerData';
import StatCard from '../components/Dashboard/StatCard';
import ProfitLab from '../components/Dashboard/ProfitLab';
import StockPredictor from '../components/Dashboard/StockPredictor';
import SentimentPulse from '../components/Dashboard/SentimentPulse';

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 flex flex-col gap-8">
      
      {/* Top Navigation Bar (Dashboard Specific) */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-pink-500 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mission Control</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Seller <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">Workbench</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-[#12121a] border border-gray-800 rounded-2xl px-4 py-2 hover:border-gray-700 transition-all cursor-text ring-offset-black focus-within:ring-2 focus-within:ring-pink-500/50">
             <Search className="w-4 h-4 text-gray-500" />
             <input type="text" placeholder="Search analytics..." className="bg-transparent border-none outline-none text-sm w-48 text-gray-300 placeholder:text-gray-600 font-medium" />
          </div>
          <div className="flex items-center gap-2">
             <button className="w-11 h-11 rounded-2xl bg-[#12121a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all relative">
                <Bell className="w-4 h-4" />
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-500 border-2 border-[#12121a]"></div>
             </button>
             <button className="w-11 h-11 rounded-2xl bg-[#12121a] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all">
                <Mail className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SELLER_STATS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Primary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(350px,_auto)]">
        
        {/* Revenue Analytics (Wide) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 bg-[#12121a]/80 backdrop-blur-md border border-gray-800 p-8 rounded-[40px] flex flex-col gap-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white">Revenue Velocity</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Global Performance Trend</p>
            </div>
            <select className="bg-[#0a0a0c] border border-gray-800 rounded-xl px-4 py-2 text-xs font-bold text-gray-400 outline-none focus:border-pink-500 transition-colors">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>

          <div className="flex-1 w-full mt-4 min-h-[250px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', borderRadius: '16px', border: '1px solid #1f2937', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#ec4899' }}
                />
                <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stock Predictor (Compact) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4"
        >
          <StockPredictor />
        </motion.div>

        {/* Profit Simulator (Medium) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5"
        >
          <ProfitLab />
        </motion.div>

        {/* Sentiment Pulse (Medium) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-7"
        >
          <SentimentPulse />
        </motion.div>

        {/* Order Pipeline (Wide Horizontal) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-12 bg-[#12121a]/80 backdrop-blur-md border border-gray-800 p-8 rounded-[40px] shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-extrabold text-white">Order Pipeline</h3>
             <button className="text-xs font-bold text-gray-500 hover:text-pink-500 transition-colors uppercase tracking-[0.2em]">Live View <ArrowUpRight className="inline w-3 h-3" /></button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 relative">
             <div className="absolute top-1/2 left-0 w-full h-px bg-gray-800 hidden md:block"></div>
             
             {ORDER_PIPELINE.map((stage, idx) => (
                <div key={stage.id} className="flex-1 w-full relative z-10 flex flex-col items-center gap-4 group">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-xl ${
                        idx === 0 ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' : 
                        idx === 1 ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                        {stage.id === 'NEW' ? <ShoppingBag className="w-7 h-7" /> : stage.id === 'PROC' ? <Loader2 className="w-7 h-7 animate-spin" /> : <CheckCircle2 className="w-7 h-7" />}
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{stage.count}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stage.label}</div>
                    </div>
                </div>
             ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
