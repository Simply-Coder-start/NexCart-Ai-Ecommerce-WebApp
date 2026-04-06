import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hexagon, Home, ShoppingBag, Package, ShoppingCart, Search, LogIn } from 'lucide-react';

import { useCart } from '../context/CartContext';

export default function Navbar() {
  const location = useLocation();
  const { cartCount } = useCart();

  // Helper component for navigation links
  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          isActive ? 'bg-[#202022] text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Icon className="w-4 h-4" /> {label}
      </Link>
    );
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800/50 sticky top-0 bg-[#07070a]/90 backdrop-blur-md z-50">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <Hexagon className="w-8 h-8 text-[#d946ef] fill-[#d946ef]" />
        <span className="text-2xl font-bold tracking-tight text-white">NexCart</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden lg:flex items-center bg-[#131315] rounded-full px-2 py-1.5 border border-gray-800/60">
        <NavItem to="/" icon={Home} label="Home" />
        <NavItem to="/shop" icon={ShoppingBag} label="Shop" />
        <NavItem to="/orders" icon={Package} label="Orders" />
        <NavItem to="/cart" icon={ShoppingCart} label="Cart" />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button 
          onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
          className="hidden xl:flex items-center h-11 bg-[#131315] rounded-full border border-gray-800/60 overflow-hidden pl-1 hover:border-gray-600 transition-colors cursor-text text-left group"
        >
          <span className="px-4 text-xs font-medium text-gray-400 border-r border-gray-700 h-full flex items-center group-hover:text-white transition-colors">All</span>
          <span className="bg-transparent border-none outline-none px-4 text-sm w-64 text-gray-500">Search products... (Cmd+K)</span>
          <div className="bg-gradient-to-r from-[#d946ef] to-[#db2777] h-full px-5 flex items-center justify-center group-hover:opacity-90 transition-opacity">
            <Search className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Cart Icon */}
        <Link to="/cart" className="w-11 h-11 rounded-full border border-gray-800 bg-[#131315] flex items-center justify-center hover:bg-gray-800 transition-colors text-white relative">
          <ShoppingCart className="w-4 h-4" />
          {/* Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d946ef] text-[10px] font-bold flex items-center justify-center rounded-full text-white animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/login" className="h-11 px-6 rounded-full bg-gradient-to-r from-[#d946ef] to-[#db2777] font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity text-white">
          <LogIn className="w-4 h-4" /> Login
        </Link>
      </div>
    </nav>
  );
}
