import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';

export default function ProfitLab() {
  const [priceAdjustment, setPriceAdjustment] = useState(0);
  const baseRevenue = 1245890;
  const baseUnits = 4580;
  const unitPrice = 2750;

  // Simple simulator logic
  // Assume: 1% drop in price leads to 2% increase in sales volume
  const priceMultiplier = (1 + priceAdjustment / 100);
  const volumeMultiplier = (1 - (priceAdjustment / 100) * 2);
  const projectedRevenue = baseRevenue * priceMultiplier * volumeMultiplier;
  const revenueDifference = projectedRevenue - baseRevenue;

  return (
    <div className="bg-[#12121a]/80 backdrop-blur-md border border-gray-800 p-8 rounded-[32px] flex flex-col gap-6 h-full shadow-lg relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 blur-[50px]"></div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white">Profit Lab</h3>
          <p className="text-xs text-gray-500 font-medium">Pricing Strategy Simulator</p>
        </div>
      </div>

      <div className="space-y-6 mt-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Price Adjustment</span>
            <span className={`font-black ${priceAdjustment >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {priceAdjustment > 0 ? '+' : ''}{priceAdjustment}%
            </span>
          </div>
          <input 
            type="range" 
            min="-30" 
            max="30" 
            value={priceAdjustment} 
            onChange={(e) => setPriceAdjustment(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-gray-800/50">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Projected Revenue</span>
              <span className="text-2xl font-black text-white">₹{Math.round(projectedRevenue).toLocaleString()}</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
              revenueDifference >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
            }`}>
              {revenueDifference >= 0 ? <TrendingUp className="w-3 h-3" /> : <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>}
              {revenueDifference >= 0 ? '+' : ''}{Math.round((revenueDifference / baseRevenue) * 100)}% Impact
            </div>
          </div>
        </div>
        
        <p className="text-[11px] text-gray-500 leading-relaxed italic bg-black/20 p-3 rounded-xl border border-white/5">
          Based on historical demand, a {Math.abs(priceAdjustment)}% {priceAdjustment > 0 ? 'increase' : 'decrease'} in price 
          is estimated to shift volume by {Math.abs(Math.round(volumeMultiplier * 100 - 100))}% in this category.
        </p>
      </div>

      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity mt-auto">
        Apply Simulation to Catalog
      </button>
    </div>
  );
}
