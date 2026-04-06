import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Upload, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getRatingLabel = (r) => {
    switch(r) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Excellent';
      case 5: return 'Stunning';
      default: return 'Select Rating';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-pink-500 mb-2">
            <Star className="w-4 h-4 fill-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Customer Experience</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Feedback</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Product #{id}</p>
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="space-y-10"
            >
              {/* Rating Selector */}
              <div className="bg-[#12121a] border border-gray-800 rounded-[32px] p-10 text-center shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] group-hover:bg-pink-500/10 transition-colors duration-700"></div>
                 
                 <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">How would you rate it?</h4>
                 
                 <div className="flex items-center justify-center gap-4 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        className="transition-all duration-300 transform hover:scale-110 active:scale-95"
                      >
                        <Star 
                           className={`w-12 h-12 transition-all ${
                             (hoverRating || rating) >= s 
                               ? 'text-pink-500 fill-pink-500' 
                               : 'text-gray-800'
                           }`} 
                        />
                      </button>
                    ))}
                 </div>
                 <p className="text-xl font-black text-white tracking-widest uppercase transition-all duration-300">
                    {getRatingLabel(hoverRating || rating)}
                 </p>
              </div>

              {/* Text Area */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Write a review</label>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Optional but helpful</span>
                 </div>
                 <textarea 
                    placeholder="Tell us what you loved or how we can improve..."
                    className="w-full h-48 bg-[#12121a] border border-gray-800 rounded-3xl p-6 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all text-sm font-medium resize-none text-white shadow-inner"
                 />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                 <button 
                  type="submit"
                  disabled={rating === 0}
                  className="flex-1 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[28px] text-white font-black uppercase tracking-[0.2em] shadow-2xl hover:opacity-90 disabled:opacity-20 transition-all flex items-center justify-center gap-3 text-xs"
                 >
                    Submit Feedback <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
               key="success"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center space-y-8 py-20"
            >
               <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] mb-4 animate-in zoom-in duration-500">
                  <MessageSquare className="w-10 h-10" />
               </div>
               <div>
                  <h1 className="text-4xl font-black text-white tracking-tight mb-4">Review <span className="text-emerald-400">Captured</span></h1>
                  <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                    Thank you for your valuable feedback! Your insights help other shoppers and help us improve.
                  </p>
               </div>
               
               <div className="flex flex-col gap-4 max-w-xs mx-auto pt-6">
                  <button onClick={() => navigate('/orders')} className="w-full py-4 bg-white/5 border border-gray-800 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
