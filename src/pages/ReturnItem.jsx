import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, ShieldCheck, Box, RefreshCcw } from 'lucide-react';

export default function ReturnItem() {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [method, setMethod] = useState('');

  const reasons = [
    'Product is damaged or defective',
    'Performance not as expected',
    'Item arrived late',
    'Changed my mind',
    'Received wrong item'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 p-6 md:p-12 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-8">
           <span className="hover:text-pink-500 cursor-pointer" onClick={() => navigate('/orders')}>Orders</span>
           <span>›</span>
           <span className="text-pink-500">Return Workflow</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header>
                <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                  Why are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">returning this?</span>
                </h1>
                <p className="text-gray-500 text-sm mt-2 font-medium">Order #{orderId} • Product ID: {productId}</p>
              </header>

              <div className="grid grid-cols-1 gap-4">
                {reasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`flex items-center justify-between p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                      reason === r 
                        ? 'border-pink-500 bg-pink-500/5 ring-4 ring-pink-500/10' 
                        : 'border-gray-800 bg-[#12121a] hover:border-gray-700'
                    }`}
                  >
                    <span className={`text-sm font-bold ${reason === r ? 'text-white' : 'text-gray-400'}`}>{r}</span>
                    {reason === r && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                 <button onClick={() => navigate('/orders')} className="text-sm font-black text-gray-500 hover:text-white uppercase tracking-widest px-4">Cancel</button>
                 <button 
                  disabled={!reason}
                  onClick={() => setStep(2)}
                  className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-black text-sm shadow-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                    Next Step <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
               key="step2"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
            >
               <header>
                 <button onClick={() => setStep(1)} className="flex items-center gap-2 text-pink-500 mb-4 hover:opacity-80">
                    <ChevronLeft className="w-4 h-4" /> <span className="text-xs font-black uppercase">Back to Reason</span>
                 </button>
                 <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                   How should we <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">refund you?</span>
                 </h1>
               </header>

               <div className="space-y-4">
                  {[
                    { id: 'wallet', title: 'NexCart Wallet', desc: 'Instant refund to your store credit account.', icon: ShieldCheck },
                    { id: 'original', title: 'Original Payment', desc: 'Refund to credit/debit card (takes 3-5 business days).', icon: RefreshCcw }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex gap-6 p-8 rounded-[32px] border-2 text-left transition-all duration-300 relative overflow-hidden ${
                        method === m.id 
                          ? 'border-pink-500 bg-pink-500/5 shadow-[0_0_40px_rgba(236,72,153,0.1)]' 
                          : 'border-gray-800 bg-[#12121a] hover:border-gray-700'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                         method === m.id ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-500'
                      }`}>
                         <m.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">{m.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                      </div>
                      {method === m.id && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>}
                    </button>
                  ))}
               </div>

               <button 
                onClick={handleSubmit}
                disabled={!method}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[28px] text-white font-black uppercase tracking-[0.2em] shadow-2xl hover:opacity-90 disabled:opacity-30 transition-all text-sm mt-8"
               >
                  Complete Return Request
               </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
               key="success"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center space-y-8 py-10"
            >
               <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] mb-4">
                  <Box className="w-10 h-10" />
               </div>
               <div>
                  <h1 className="text-4xl font-black text-white tracking-tight mb-4">Request <span className="text-emerald-400">Accepted</span></h1>
                  <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
                    Your return for **#{orderId}** has been initiated. Please pack the item and keep it ready for pickup. A confirmation email has been sent.
                  </p>
               </div>
               
               <div className="flex flex-col gap-4 max-w-xs mx-auto pt-6">
                  <button onClick={() => navigate('/orders')} className="w-full py-4 bg-[#12121a] border border-gray-800 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all">Go to Orders</button>
                  <button onClick={() => navigate('/')} className="w-full text-xs font-black text-gray-500 hover:text-pink-500 transition-colors uppercase tracking-widest">Back to Home</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
