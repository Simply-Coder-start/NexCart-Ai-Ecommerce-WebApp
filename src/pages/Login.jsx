import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={credentialResponse => {
                const decodedToken = jwtDecode(credentialResponse.credential);
                login({
                  name: decodedToken.name,
                  email: decodedToken.email,
                  picture: decodedToken.picture
                });
                navigate('/');
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
              shape="pill"
              theme="filled_black"
            />
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
