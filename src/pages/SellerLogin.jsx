import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LayoutDashboard, ArrowRight, Hexagon, Loader2, Store } from 'lucide-react';

export default function SellerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mocking an authentication delay
    setTimeout(() => {
      // For demonstration, we'll mark the workspace as 'seller' in localStorage as well
      localStorage.setItem('nexcart_workspace', 'seller');
      setIsLoading(false);
      navigate('/seller/dashboard');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl mb-4 group cursor-pointer" onClick={() => navigate('/')}>
             <Hexagon className="w-8 h-8 text-white fill-white/20 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-pink-500 mb-2">NexCart Engine</h2>
          <h1 className="text-4xl font-black text-white tracking-tight">Seller <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Portal</span></h1>
        </div>

        {/* Login Card */}
        <div className="bg-[#12121a]/80 backdrop-blur-2xl border border-gray-800 p-10 rounded-[40px] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Merchant Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@nexcart.com"
                  className="w-full bg-[#0a0a0c] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-700" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secret Key</label>
                <button type="button" className="text-[9px] font-bold text-pink-500 hover:text-pink-400 uppercase tracking-tighter">Forgot Key?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0c] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all placeholder:text-gray-700" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Enter Workspace <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
             <p className="text-gray-500 text-xs font-semibold">Not a registered merchant? <span className="text-white hover:text-pink-500 cursor-pointer transition-colors">Apply now</span></p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-10 flex items-center justify-center gap-6 text-gray-600">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Store className="w-3 h-3" /> Secure Node</div>
           <div className="w-px h-3 bg-gray-800"></div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><LayoutDashboard className="w-3 h-3" /> Mission Control</div>
        </div>
      </motion.div>
    </main>
  );
}
