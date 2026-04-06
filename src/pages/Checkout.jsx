import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, AlertTriangle, ShieldCheck, Plus, Minus, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export default function Checkout() {
  const [quantity, setQuantity] = useState(1);
  const PRICE = 44900;
  const DELIVERY = 40;

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col flex-1 pb-32">
      {/* Title & Secure Lock */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Checkout</h1>
        <div className="flex items-center gap-1.5 text-gray-400 font-medium bg-[#131315] px-3 py-1.5 rounded-lg border border-gray-800">
          <Lock className="w-4 h-4 text-[#a855f7]" /> <span className="text-sm">Secure Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 items-start">
        
        {/* ================= LEFT COLUMN: MAIN FLOW ================= */}
        <div className="flex flex-col gap-6">
          
          {/* 1. Payment Method Card */}
          <section className="bg-[#131315] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-extrabold text-white mb-5 flex items-center gap-2">
              <span className="text-[#d946ef]">1</span> <span className="text-gray-600">|</span> Payment Method
            </h2>
            <div className="border border-[#a855f7] bg-gradient-to-r from-[#a855f7]/10 to-transparent rounded-xl p-5 flex items-start gap-4 transition-all">
               <div className="bg-gradient-to-br from-[#d946ef] to-[#db2777] p-2.5 rounded-xl shadow-lg mt-0.5">
                 <QrCode className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-lg leading-tight">Pay by scanning the QR code (UPI)</h3>
                 <p className="text-sm text-gray-400 mt-2">Scan from your favorite UPI app (Google Pay, PhonePe, Paytm, Amazon Pay, etc.) to securely complete the transaction.</p>
               </div>
            </div>
          </section>

          {/* 2. Warning Banner */}
          <section className="bg-amber-900/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4 shadow-lg">
             <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
             <div>
               <h4 className="text-amber-500 font-bold mb-1 text-[15px]">One-time password required at time of delivery</h4>
               <p className="text-sm text-amber-200/60 leading-snug text-balance">To ensure safe delivery of this high-value order, the delivery agent will ask you for a 6-digit OTP that will be sent to your registered mobile number.</p>
             </div>
          </section>

          {/* 3. Subscription Banner */}
          <section className="relative overflow-hidden bg-gradient-to-r from-[#171725] to-[#131315] border border-blue-900/50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
             {/* Background decoration */}
             <div className="absolute -right-10 -top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

             <div className="flex items-center gap-4 relative z-10">
               <ShieldCheck className="w-10 h-10 text-blue-400" />
               <div>
                 <h4 className="text-white font-extrabold text-[17px] tracking-wide">NexCart <span className="text-blue-400 italic">Prime</span></h4>
                 <p className="text-sm text-blue-200/60 mt-1">Get free Fast delivery on this order by joining Prime</p>
               </div>
             </div>
             <button className="w-full md:w-auto px-6 py-2.5 bg-[#1a1a1c] border border-blue-500/50 text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all shadow-md relative z-10">
               Try Prime Free
             </button>
          </section>

          {/* 4. Order Details Card */}
          <section className="bg-[#131315] border border-gray-800 rounded-2xl p-6 shadow-xl relative">
            <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2">
              <span className="text-[#d946ef]">2</span> <span className="text-gray-600">|</span> Order Details
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Thumbnail */}
              <div className="w-full md:w-32 h-32 bg-white rounded-xl p-2 flex-shrink-0 flex items-center justify-center border border-gray-700 shadow-inner">
                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop" alt="Apple Watch" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-white font-bold text-[15px] leading-snug line-clamp-2 hover:text-[#d946ef] cursor-pointer transition-colors">
                      Apple Watch Series 9 [GPS 45mm] Smartwatch with Midnight Aluminum Case
                    </h3>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                       <span className="text-[10px] bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-gray-600">
                         Fulfilled by NexCart
                       </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Sold by: Appario Retail Private Ltd</p>
                  </div>

                  <div className="text-left md:text-right w-full md:w-auto">
                    <span className="text-xl font-extrabold text-white">₹{PRICE.toLocaleString()}</span>
                    <p className="text-xs text-gray-400 mt-1 line-through">₹{(PRICE * 1.18).toFixed(0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Qty & Delivery Option Tools */}
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-gray-800/80 pt-6">
                  
                  {/* Quantity Selector */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-gray-500 font-bold">Quantity</span>
                    <div className="flex items-center gap-3 bg-[#1a1a1c] border border-gray-700 rounded-lg p-1 w-fit">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-bold w-6 text-center select-none">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delivery Radio */}
                  <label className="flex items-start gap-3 cursor-pointer group mt-2 sm:mt-0 bg-[#1a1a1c] p-3 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors w-full sm:w-auto">
                    <input type="radio" name="delivery" defaultChecked className="mt-1 w-4 h-4 accent-[#a855f7] cursor-pointer" />
                    <div>
                      <div className="text-sm font-extrabold text-[#d946ef] group-hover:text-pink-400 transition-colors">FREE Delivery</div>
                      <div className="text-xs text-gray-300 font-medium mt-0.5">Sunday, 12 April</div>
                    </div>
                  </label>
                </div>

              </div>
            </div>
          </section>

          {/* 5. Bottom Action Bar (Mobile Sticky) */}
          <div className="lg:hidden bg-[#131315]/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order Total</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1">₹{(PRICE * quantity).toLocaleString()}</span>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3.5 px-8 rounded-xl transition-colors shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              Pay with UPI
            </button>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: STICKY SUMMARY ================= */}
        <div className="hidden lg:block sticky top-24">
          <section className="bg-[#131315] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d946ef]/5 rounded-full blur-[80px] pointer-events-none"></div>

            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-4 rounded-xl transition-all mb-8 text-lg shadow-[0_0_20px_rgba(250,204,21,0.15)] flex justify-center items-center gap-2 hover:scale-[1.02]">
              <QrCode className="w-5 h-5" /> Pay with UPI
            </button>
            
            <h3 className="font-extrabold text-white text-lg mb-5 pb-3 border-b border-gray-800">Order Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-300 font-medium">
                <span>Items ({quantity}):</span>
                <span>₹{(PRICE * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300 font-medium">
                <span>Delivery:</span>
                <span>₹{DELIVERY.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300 font-medium">
                <span>Marketplace Fee:</span>
                <span>₹0.00</span>
              </div>
              
              <div className="flex justify-between text-[#22c55e] font-bold">
                <span>Free Delivery discount:</span>
                <span>-₹{DELIVERY.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-800 flex justify-between items-center bg-[#1a1a1c] -mx-6 -mb-6 px-6 py-5 rounded-b-2xl">
              <span className="text-xl font-extrabold text-white">Order Total:</span>
              <span className="text-3xl font-extrabold text-[#d946ef] drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                ₹{(PRICE * quantity).toLocaleString()}
              </span>
            </div>
          </section>

          {/* Secure Trust text under the card */}
          <div className="flex items-start justify-center gap-2 mt-6 text-gray-500">
             <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
             <p className="text-xs leading-relaxed text-balance text-center">
               Safe and secure payments. 100% Authentic products.
             </p>
          </div>
        </div>

      </div>
    </main>
  );
}
