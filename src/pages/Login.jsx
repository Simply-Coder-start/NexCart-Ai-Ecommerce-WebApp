import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (!isLoginTab && formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const endpoint = isLoginTab 
      ? '/auth/login' 
      : '/auth/register';

    try {
      const response = await api.post(endpoint, formData);
      
      // Store auth data in local storage (Local Backend standard)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Sync with Remote Context
      login(response.data.user);

      setSuccess(isLoginTab ? "Welcome back!" : "Account created successfully!");
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);
      
      // Attempt to sync with backend first
      let userData;
      try {
        const res = await api.post('/auth/google', {
          token: credentialResponse.credential
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        userData = res.data.user;
      } catch (backendErr) {
        // Fallback to local decode if backend fails (using remote repo's method)
        console.warn("Backend Google Auth failed, falling back to local decode", backendErr);
        const decodedToken = jwtDecode(credentialResponse.credential);
        userData = {
          name: decodedToken.name,
          email: decodedToken.email,
          picture: decodedToken.picture
        };
      }
      
      // Sync with Context
      login(userData);
      
      setSuccess("Successfully logged in with Google!");
      
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setError("Google account connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20 bg-[#07070a] relative overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#d946ef] rounded-[100%] blur-[150px] opacity-[0.07] z-0"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Hexagon className="w-10 h-10 text-[#d946ef] fill-[#d946ef]" />
            <span className="text-3xl font-extrabold tracking-tight text-white">NexCart</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">{isLoginTab ? "Welcome back" : "Create an account"}</h1>
          <p className="text-gray-400 text-sm">
            {isLoginTab ? "Sign in to continue your journey" : "Join us to discover more"}
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-[#131315]/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 shadow-2xl">
          
          {/* Error / Success Toasts */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3 text-green-400 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLoginTab && (
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0c] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#d946ef] transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0c] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#d946ef] transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Password</label>
                {isLoginTab && <a href="#" className="text-xs font-semibold text-[#a855f7] hover:text-[#d946ef] transition-colors">Forgot?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-[#0a0a0c] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#d946ef] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] text-white font-bold shadow-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>{isLoginTab ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-gray-500 uppercase">Or continue with</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <div className="mt-4 flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mt-8 text-center text-sm text-gray-400">
            {isLoginTab ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLoginTab(!isLoginTab)}
              className="text-[#d946ef] font-bold hover:underline"
            >
              {isLoginTab ? "Sign up free" : "Log in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
