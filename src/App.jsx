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
import Login from './pages/Login';
import CompareDrawer from './components/CompareDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <CartProvider>
          {/* Global Wrapper handling the dark theme and flex layout */}
          <div className="min-h-screen bg-[#07070a] text-white font-sans selection:bg-pink-500 selection:text-white flex flex-col relative">
        <CommandPalette />
        <Navbar />
        <CompareDrawer />
        
        {/* The current page renders here automatically */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </CartProvider>
  </Router>
  </AuthProvider>
</GoogleOAuthProvider>
);
}
