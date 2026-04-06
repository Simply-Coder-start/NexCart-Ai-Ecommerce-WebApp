import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Compare from './pages/Compare';
import SellerDashboard from './pages/SellerDashboard';
import SellerLogin from './pages/SellerLogin';
import TrackOrder from './pages/TrackOrder';
import ReturnItem from './pages/ReturnItem';
import ReviewProduct from './pages/ReviewProduct';
import Support from './pages/Support';
import CompareDrawer from './components/CompareDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "336009968441-iks5jriaeug82cjo3d4j8et7bfhr32ce.apps.googleusercontent.com";

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/seller-login" element={<SellerLogin />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  
                  {/* Protected Routes from Local Version */}
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Order Action Pages */}
                  <Route 
                    path="/track-order/:id" 
                    element={
                      <ProtectedRoute>
                        <TrackOrder />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/return-item/:orderId/:productId" 
                    element={
                      <ProtectedRoute>
                        <ReturnItem />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/review-product/:id" 
                    element={
                      <ProtectedRoute>
                        <ReviewProduct />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/support" 
                    element={
                      <ProtectedRoute>
                        <Support />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </div>
            </div>
          </CartProvider>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
