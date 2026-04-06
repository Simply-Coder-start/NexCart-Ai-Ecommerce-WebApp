import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Hexagon, Home, ShoppingBag, Package, ShoppingCart, Search, LogIn, LogOut, 
  MoreVertical, Settings, Heart, User, LayoutDashboard, Store
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [activeWorkspace, setActiveWorkspace] = React.useState(() => {
    return localStorage.getItem('nexcart_workspace') || 'user';
  });

  const handleSetWorkspace = (ws) => {
    setActiveWorkspace(ws);
    localStorage.setItem('nexcart_workspace', ws);
  };

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
    <>
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
          {activeWorkspace === 'seller' && (
            <NavItem to="/seller/dashboard" icon={LayoutDashboard} label="Dashboard" />
          )}
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
          <div 
            onClick={() => navigate('/cart')}
            className="w-11 h-11 rounded-full border border-gray-800 bg-[#131315] flex items-center justify-center hover:bg-gray-800 transition-colors text-white relative cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            {/* Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#d946ef] text-[10px] font-bold flex items-center justify-center rounded-full text-white shadow-[0_0_10px_rgba(217,70,239,0.5)] animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth Actions */}
          {user ? (
            <div className="flex items-center gap-3 bg-[#131315] border border-gray-800 rounded-full h-11 px-1 pr-1 relative">
              <div className="flex items-center gap-3 pl-1 pr-3">
                <img 
                  src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  alt="User Avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-gray-700"
                  referrerPolicy="no-referrer"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-white max-w-[80px] truncate leading-tight">{user.name}</span>
                  <span className="text-[10px] text-gray-500 font-medium capitalize">{activeWorkspace} Profile</span>
                </div>
              </div>

              {/* Kebab Menu Trigger */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                  isMenuOpen ? 'bg-pink-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-[120%] right-0 w-56 max-w-[95vw] overflow-x-hidden bg-[#12121a]/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[60] animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2 flex flex-col gap-1">
                    <div className="px-4 py-2 border-b border-gray-800/50 mb-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Navigation</p>
                    </div>
                    <button onClick={() => { navigate('/orders'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                      <Package className="w-4 h-4 text-gray-500 group-hover:text-pink-500" />
                      My Orders
                    </button>
                    <button onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                      <Heart className="w-4 h-4 text-gray-500 group-hover:text-pink-500" />
                      Wishlist
                    </button>
                    <button 
                      onClick={() => { setIsSettingsModalOpen(true); setIsMenuOpen(false); }} 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
                    >
                      <Settings className="w-4 h-4 text-gray-500 group-hover:text-pink-500" />
                      Settings
                    </button>
                    
                    <div className="h-px bg-gray-800 my-1"></div>
                    
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="h-11 px-6 rounded-full bg-gradient-to-r from-[#d946ef] to-[#db2777] font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
        </div>
      </nav>

      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={handleSetWorkspace}
      />
    </>
  );
}
