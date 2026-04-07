import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ProductImage from '../components/ProductImage';


const BRANDS = ['CHANEL', 'UNIQLO', 'H&M', 'DIOR', 'HERMÈS', 'VERSACE', 'ROLEX', 'BURBERRY', 'ARMANI', 'GIVENCHY', 'TIFFANY & CO.', 'VOGUE', 'GUCCI', 'PRADA', 'ZARA'];

export default function Home() {
  const { addToCart } = useCart();
  const heroProduct = products.find(p => p.id === 1) || products[0];
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Main Hero Section */}
      <main className="max-w-[1600px] w-full mx-auto px-8 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-grow">
        
        {/* Left Column - Content */}
        <div className="flex flex-col items-start pt-8">

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-2 text-white">
            Fashion Meets
          </h1>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#f472b6] text-transparent bg-clip-text">
            Artificial<br/>Intelligence
          </h1>

          <p className="text-gray-400 text-lg max-w-[480px] mb-10 leading-relaxed">
            Stop guessing sizes. Upload your photo and watch our AI drape the latest trends on your digital twin instantly.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link to="/shop" className="h-12 px-8 rounded-full bg-gradient-to-r from-[#d946ef] to-[#db2777] font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(217,70,239,0.3)]">
              <ShoppingBag className="w-5 h-5" /> Start Shopping
            </Link>
            <Link to="/compare" className="h-12 px-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <Sparkles className="w-5 h-5" /> Compare Products
            </Link>
          </div>

          <div className="w-full h-px bg-gray-800/60 mb-8"></div>

          <div className="flex items-center gap-10">
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">98%</h3>
              <p className="text-sm text-gray-500 font-medium">Fit Accuracy</p>
            </div>
            <div className="w-px h-10 bg-gray-800"></div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">24h</h3>
              <p className="text-sm text-gray-500 font-medium">Delivery</p>
            </div>
            <div className="w-px h-10 bg-gray-800"></div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">10k+</h3>
              <p className="text-sm text-gray-500 font-medium">Happy Users</p>
            </div>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="relative w-full aspect-[4/3] lg:aspect-square bg-[#f4f4f5] rounded-[40px] flex items-center justify-center p-8 overflow-hidden shadow-2xl shadow-pink-900/10 border border-gray-800/30">
          <ProductImage 
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop" 
            alt="Red velvet dress on hanger" 
            className="h-[90%] object-contain drop-shadow-2xl mix-blend-multiply"
          />


          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gradient-to-r from-[#1a1a1c]/90 to-[#222225]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl shadow-black/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 border border-gray-700">
                 <ProductImage 
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=100&auto=format&fit=crop" 
                    alt="Thumbnail" 
                    className="h-full object-contain mix-blend-multiply"
                 />

              </div>
              
              <div>
                <h4 className="text-white font-bold text-sm mb-0.5">Royal Traditional Lehenga</h4>
                <p className="text-[#a855f7] text-xs font-medium">Best Match: Size M</p>
              </div>
            </div>

            <button 
              onClick={() => addToCart(heroProduct)}
              className="h-9 px-5 rounded-lg bg-gradient-to-r from-[#d946ef] to-[#db2777] font-semibold text-xs text-white hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
        </div>

      </main>

      {/* Infinite Scrolling Brands Marquee */}
      <div className="w-full border-y border-gray-800/50 bg-[#0a0a0c] py-8 overflow-hidden relative flex marquee-container mt-auto">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0c] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee whitespace-nowrap">
          {BRANDS.map((brand, i) => (
            <span key={i} className="mx-10 text-gray-500/80 font-bold text-xl md:text-2xl tracking-[0.2em] hover:text-white transition-colors cursor-pointer select-none">
              {brand}
            </span>
          ))}
        </div>
        
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {BRANDS.map((brand, i) => (
            <span key={i} className="mx-10 text-gray-500/80 font-bold text-xl md:text-2xl tracking-[0.2em] hover:text-white transition-colors cursor-pointer select-none">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
