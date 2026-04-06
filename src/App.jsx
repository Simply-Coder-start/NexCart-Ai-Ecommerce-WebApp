import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <Router>
      {/* Global Wrapper handling the dark theme and flex layout */}
      <div className="min-h-screen bg-[#07070a] text-white font-sans selection:bg-pink-500 selection:text-white flex flex-col relative">
        <CommandPalette />
        <Navbar />
        
        {/* The current page renders here automatically */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
