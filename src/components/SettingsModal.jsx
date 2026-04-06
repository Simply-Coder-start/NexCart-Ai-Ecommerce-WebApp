import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Store, CheckCircle2, TrendingUp } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, activeWorkspace, setActiveWorkspace }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const workspaces = [
    {
      id: 'user',
      title: 'Personal Account',
      subtitle: 'Shop, track orders, and manage wishlist.',
      icon: ShoppingBag,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 'seller',
      title: 'Seller Workspace',
      subtitle: 'Manage inventory, view sales, and grow your business.',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl bg-[#12121a] border border-gray-800 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-800/50">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Account Settings</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your profiles and preferences</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Switch Account Workspace</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workspaces.map((ws) => {
                const isActive = activeWorkspace === ws.id;
                const Icon = ws.icon;
                
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      if (ws.id === 'seller') {
                        onClose();
                        navigate('/seller-login');
                      } else {
                        setActiveWorkspace(ws.id);
                      }
                    }}
                    className={`relative flex flex-col items-start p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                      isActive 
                        ? 'border-pink-500 bg-pink-500/5 ring-2 ring-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]' 
                        : 'border-gray-800 bg-[#0a0a0c] hover:border-gray-700'
                    }`}
                  >
                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-pink-500 text-[10px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </div>
                    )}

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${
                      isActive ? `bg-gradient-to-r ${ws.color} text-white` : 'bg-gray-900 text-gray-500'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h4 className={`text-lg font-bold mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {ws.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {ws.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-800 text-gray-400 font-bold hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
