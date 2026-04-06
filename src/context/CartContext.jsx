import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('nexcart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('nexcart_favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  const [compareList, setCompareList] = useState(() => {
    const savedCompare = localStorage.getItem('nexcart_compare');
    return savedCompare ? JSON.parse(savedCompare) : [];
  });

  useEffect(() => {
    localStorage.setItem('nexcart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexcart_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('nexcart_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const addToCompare = (product) => {
    setCompareList(prev => {
      // Don't add if already there
      if (prev.find(item => item.id === product.id)) return prev;
      // Allow max 4 items to compare
      if (prev.length >= 4) {
        alert("You can only compare up to 4 items at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      favorites, 
      compareList,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      toggleFavorite,
      addToCompare,
      removeFromCompare,
      clearCompare,
      cartCount,
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};
