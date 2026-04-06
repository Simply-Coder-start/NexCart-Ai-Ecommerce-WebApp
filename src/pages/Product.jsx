import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, Star, MapPin, ShieldCheck, Truck, RefreshCcw, 
  CreditCard, ChevronLeft, ShoppingCart, Zap, Share2, Heart, Trophy
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import axios from 'axios';
import ProductRecommendations from '../components/ProductRecommendations';
import { useCart } from '../context/CartContext';

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop", // Smartwatch main
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517420879255-ae365c7820e1?q=80&w=800&auto=format&fit=crop",
];

const COLORS = [
  { name: 'Midnight Black', image: MOCK_IMAGES[0] },
  { name: 'Rose Gold', image: MOCK_IMAGES[1] },
  { name: 'Ocean Blue', image: MOCK_IMAGES[2] },
];

const OFFERS = [
  { title: "No Cost EMI", desc: "Upto ₹1,500 EMI interest savings on select Credit Cards." },
  { title: "Bank Offer", desc: "10% Instant Discount up to ₹1000 on ICICI Bank Cards." },
  { title: "Cashback", desc: "5% cashback with NexCart Pay Credit Card." }
];

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites } = useCart();
  const product = products.find((p) => p.id === parseInt(id));

  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [protectionPlan, setProtectionPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = () => {
    setIsLoading(true);
    // Simulate slight delay for premium feel
    setTimeout(() => {
      addToCart(product, Number(quantity));
      setIsLoading(false);
    }, 500);
  };

  const handleBuyNow = () => {
    addToCart(product, Number(quantity));
    navigate('/cart');
  };

  const handleWishlist = () => {
    toggleFavorite(product.id);
  };
  
  if (!product) {
    return (
      <main className="max-w-[1600px] w-full mx-auto px-4 py-40 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-[#a855f7] hover:underline">Return to Shop</Link>
      </main>
    );
  }

  const displayImages = [product.image, ...MOCK_IMAGES.slice(1)];

  return (
    <main className="max-w-[1600px] w-full mx-auto px-4 md:px-8 pt-6 pb-20 flex flex-col flex-1">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs md:text-sm mb-6 text-gray-400">
        <Link to="/" className="hover:text-[#d946ef] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link to="/shop" className="hover:text-[#d946ef] transition-colors">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_340px] xl:grid-cols-[auto_1fr_380px] gap-8 xl:gap-12 items-start">
        
        {/* ================= LEFT COLUMN: MEDIA GALLERY ================= */}
        <div className="flex flex-col md:flex-row-reverse lg:flex-row gap-4 w-full lg:w-[450px] xl:w-[500px]">
          
          {/* Main Image Spotlight */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-800 p-4 aspect-square flex items-center justify-center relative group overflow-hidden shadow-2xl shadow-black/40">
            <img 
              src={displayImages[activeImage]} 
              alt="Product Main" 
              className="w-full h-full object-contain mix-blend-multiply scale-100 group-hover:scale-125 transition-transform duration-500 origin-center cursor-crosshair"
            />
            {/* Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 rounded-full bg-[#131315]/80 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-[#a855f7] hover:border-[#a855f7] transition-all text-white shadow-xl">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#131315]/80 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all text-white shadow-xl">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar py-1">
            {displayImages.map((img, idx) => (
              <button 
                key={idx}
                onMouseEnter={() => setActiveImage(idx)}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl bg-white p-2 border-2 transition-all ${
                  activeImage === idx 
                  ? 'border-[#d946ef] shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
                  : 'border-gray-800 hover:border-gray-500'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: PRODUCT INFO ================= */}
        <div className="flex flex-col gap-5 min-w-0">
          
          <div className="border-b border-gray-800/80 pb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-[1.2] mb-3">
              {product.title}
            </h1>
            
            {/* Store & Rating */}
            <div className="flex flex-wrap items-center gap-4 text-sm mb-2">
              <a href="#" className="text-[#a855f7] hover:text-[#d946ef] font-semibold transition-colors">
                Visit the Apple Store
              </a>
              <div className="w-px h-4 bg-gray-700"></div>
              <div className="flex items-center gap-1.5 cursor-pointer group">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-700 fill-gray-700'}`} />
                  ))}
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-1 group-hover:text-gray-300" />
                </div>
                <span className="text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors">{product.reviews} ratings</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-[#1a1a1c] border border-[#a855f7]/30 text-white text-xs px-2 py-0.5 rounded font-bold">Amazon's <span className="text-[#f59e0b]">Choice</span></span>
              <span className="text-xs text-gray-400">in {product.category}</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="border-b border-gray-800/80 pb-5">
            <div className="flex items-start gap-4 mb-2">
              <span className="text-4xl text-red-500 font-light mt-1">-18%</span>
              <div className="flex text-5xl font-extrabold text-white">
                <span className="text-2xl mt-1.5 mr-1">₹</span>{product.price}
              </div>
            </div>
            <div className="text-gray-400 text-sm mb-1">
              M.R.P.: <span className="line-through">₹{(parseFloat(product.price) * 1.18).toFixed(2)}</span>
            </div>
            <p className="text-sm font-medium text-gray-300 mb-2">Inclusive of all taxes</p>
            <p className="text-sm">
              <span className="font-bold text-white">EMI</span> starts at ₹2,177. No Cost EMI available <a href="#" className="text-[#a855f7] hover:underline">EMI options</a>
            </p>
          </div>

          {/* Offers Scroller */}
          <div className="border-b border-gray-800/80 pb-6 pt-2">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]/20" /> Offers
            </h3>
            <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-2">
              {OFFERS.map((offer, idx) => (
                <div key={idx} className="w-[180px] snap-center flex-shrink-0 bg-[#131315] border border-gray-800 rounded-xl p-4 shadow-lg hover:border-gray-600 transition-colors cursor-pointer flex flex-col gap-2">
                  <span className="text-xs font-extrabold text-white tracking-wider uppercase">{offer.title}</span>
                  <p className="text-xs text-gray-400 leading-snug line-clamp-3">{offer.desc}</p>
                  <a href="#" className="text-xs text-[#a855f7] hover:underline mt-auto pt-1 font-semibold">1 offer &gt;</a>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Icons Row */}
          <div className="border-b border-gray-800/80 pb-6 pt-4 flex gap-2 md:gap-6 justify-between md:justify-start overflow-x-auto no-scrollbar">
            {[
              { icon: RefreshCcw, label: "10 days Replacement" },
              { icon: Truck, label: "Free Delivery" },
              { icon: ShieldCheck, label: "1 Year Warranty" },
              { icon: CreditCard, label: "Pay on Delivery" },
              { icon: Trophy, label: "Top Brand" }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-2 w-[80px] flex-shrink-0 cursor-pointer group">
                <div className="w-12 h-12 rounded-full border border-gray-700 bg-[#131315] flex items-center justify-center group-hover:border-[#d946ef] transition-colors">
                  <feature.icon className="w-5 h-5 text-gray-300 group-hover:text-[#d946ef] transition-colors" />
                </div>
                <span className="text-[10px] text-gray-400 font-medium leading-tight group-hover:text-gray-300">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Variant Selector */}
          <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-sm">Colour Options:</span>
            </div>
            <div className="flex gap-3">
              {(product.colors || []).map((colorHex, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setActiveColor(idx); setActiveImage(idx); }}
                  className={`w-16 h-16 rounded-xl bg-white p-1 border-2 transition-all relative overflow-hidden ${
                    activeColor === idx 
                    ? 'border-[#d946ef] shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
                    : 'border-transparent hover:border-gray-500'
                  }`}
                >
                  <div style={{ backgroundColor: colorHex }} className="w-full h-full rounded-[10px]" />
                  {/* Subtle checkmark overlay for selected state */}
                  {activeColor === idx && (
                    <div className="absolute inset-0 bg-[#d946ef]/10 flex items-center justify-center backdrop-blur-[1px]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Features / Details snippet */}
          <div className="pt-2">
            <h3 className="font-bold text-white mb-3">About this item</h3>
            <ul className="list-disc list-outside ml-4 text-sm text-gray-300 space-y-2">
              <li><span className="font-semibold text-white">WHY APPLE WATCH SERIES 9 —</span> Your essential companion for a healthy life is now even more powerful.</li>
              <li><span className="font-semibold text-white">CARBON NEUTRAL —</span> An aluminum Apple Watch Series 9 paired with the latest Sport Loop is carbon neutral.</li>
              <li><span className="font-semibold text-white">ADVANCED HEALTH FEATURES —</span> Keep an eye on your blood oxygen. Take an ECG anytime. Get notifications if you have an irregular heart rhythm.</li>
            </ul>
          </div>
          
        </div>

        {/* ================= RIGHT COLUMN: BUY BOX ================= */}
        <div className="w-full h-fit sticky top-24">
          <div className="bg-[#131315] border border-gray-800 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col gap-4">
            
            {/* Price again in Buy Box */}
            <div className="flex items-start">
              <span className="text-xl mt-0.5 mr-0.5 text-gray-400">₹</span>
              <span className="text-3xl font-extrabold text-white">{product.price}</span>
              <span className="text-sm mt-1 ml-0.5 text-gray-400">.00</span>
            </div>

            <div className="text-sm text-gray-300">
               <a href="#" className="text-[#a855f7] hover:underline">FREE Delivery</a> <span className="font-bold text-white">Sunday, 12 April.</span> Order within 8 hrs 30 mins.
            </div>

            <button className="flex items-center gap-1.5 text-xs font-bold text-[#a855f7] hover:text-[#d946ef] w-fit mt-1 group">
               <MapPin className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> 
               Delivering to Kolkata 700001 - Update location
            </button>

            <h3 className="text-xl font-extrabold text-emerald-400 tracking-wide mt-2">
              In stock
            </h3>

            {/* Merchant info */}
            <div className="flex flex-col gap-1 text-xs mt-1 mb-2">
               <div className="grid grid-cols-[80px_1fr] gap-2">
                 <span className="text-gray-500">Ships from</span>
                 <span className="text-gray-300 font-medium">NexCart Fulfillment</span>
               </div>
               <div className="grid grid-cols-[80px_1fr] gap-2">
                 <span className="text-gray-500">Sold by</span>
                 <a href="#" className="text-[#a855f7] hover:underline font-medium">Appario Retail Private Ltd</a>
               </div>
            </div>

            <div className="w-full h-px bg-gray-800/80 my-1"></div>

            {/* Protection Plan */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-white">Add a Protection Plan:</span>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={protectionPlan} 
                  onChange={() => setProtectionPlan(!protectionPlan)}
                  className="mt-1 w-4 h-4 rounded bg-gray-800 border-gray-600 accent-[#d946ef] cursor-pointer" 
                />
                <div className="text-xs">
                  <span className="text-[#a855f7] hover:underline font-medium transition-colors">1 Year Accidental Damage Protection</span>
                  <div className="text-gray-400 mt-0.5 text-[11px]">for <span className="text-red-400 font-semibold">₹3,499.00</span></div>
                </div>
              </label>
            </div>

            <div className="w-full h-px bg-gray-800/80 my-1"></div>

            {/* Qty Dropdown (Stylized) */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 font-medium">Quantity:</span>
              <div className="relative">
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  className="appearance-none bg-[#1a1a1c] border border-gray-700 text-white text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-[#d946ef] transition-colors cursor-pointer shadow-sm hover:bg-gray-800"
                >
                  {[1, 2, 3, 4, 5].map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#202022] border border-[#a855f7] font-bold text-sm text-[#d946ef] hover:bg-[#a855f7]/10 transition-colors shadow-lg flex items-center justify-center gap-2 opacity-100 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" /> {isLoading ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d946ef] to-[#db2777] font-bold text-sm text-white hover:opacity-90 transition-opacity shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 opacity-100 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" /> Buy Now
              </button>
            </div>

            {/* Secure transaction */}
            <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-gray-500 font-medium">
               <ShieldCheck className="w-4 h-4" /> 
               <a href="#" className="hover:text-[#a855f7] hover:underline transition-colors">Secure transaction</a>
            </div>

            {/* Add to list wrapper */}
            <div className="mt-2 text-center pt-4 border-t border-gray-800/80">
              <button onClick={handleWishlist} className="text-sm text-[#a855f7] hover:text-[#d946ef] font-medium transition-colors w-full p-2 rounded-lg hover:bg-[#1a1a1c]">
                Add to Wish List
              </button>
            </div>

          </div>
        </div>

      </div>
      
      {/* Product Recommendations Mounted at Bottom */}
      <ProductRecommendations currentProduct={product} />
    </main>
  );
}
