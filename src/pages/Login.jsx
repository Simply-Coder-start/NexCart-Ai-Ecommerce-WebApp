import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#d946ef] rounded-[100%] blur-[150px] opacity-[0.07] z-0"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Hexagon className="w-10 h-10 text-[#d946ef] fill-[#d946ef]" />
            <span className="text-3xl font-extrabold tracking-tight text-white">NexCart</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Enter your details to access your account.</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#131315]/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 shadow-2xl shadow-black">
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0a0a0c] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d946ef] focus:ring-1 focus:ring-[#d946ef] transition-all placeholder:text-gray-600"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-semibold text-[#a855f7] hover:text-[#d946ef] transition-colors">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0c] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d946ef] focus:ring-1 focus:ring-[#d946ef] transition-all placeholder:text-gray-600"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 h-12 w-full rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(217,70,239,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#1a1a1c] border border-gray-800 hover:bg-gray-800 transition-colors text-sm font-semibold text-white">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-[#1a1a1c] border border-gray-800 hover:bg-gray-800 transition-colors text-sm font-semibold text-white">
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Github
            </button>
          </div>
          
          {/* Footer link */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-sm">Don't have an account? </span>
            <a href="#" className="text-[#d946ef] text-sm font-bold hover:underline">Sign up for free</a>
          </div>

        </div>
      </div>
    </div>
  );
}
