export const SELLER_STATS = [
  { label: 'Total Revenue', value: '₹12,45,890', change: '+14.2%', color: 'from-pink-500 to-purple-600' },
  { label: 'Active Orders', value: '1,248', change: '+2.4%', color: 'from-blue-500 to-indigo-600' },
  { label: 'Total Views', value: '45.8k', change: '+18.5%', color: 'from-emerald-500 to-teal-600' },
  { label: 'Conversion', value: '3.2%', change: '-0.4%', color: 'from-amber-500 to-orange-600' },
];

export const REVENUE_CHART_DATA = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
];

export const STOCK_PREDICTIONS = [
  { id: 1, name: 'Ultra-HD Smartwatch V2', stock: 12, velocity: 3.2, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=100' },
  { id: 2, name: 'Premium Leather Boots', stock: 4, velocity: 1.1, image: 'https://images.unsplash.com/photo-1520639889313-7272a80b1886?q=80&w=100' },
  { id: 3, name: 'Noise-Cancelling Headphones', stock: 28, velocity: 4.5, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100' },
  { id: 4, name: 'Minimalist Backpack', stock: 8, velocity: 1.8, image: 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?q=80&w=100' },
];

export const SENTIMENT_DATA = [
  { word: "Durability", count: 850, mood: 'positive' },
  { word: "Packaging", count: 120, mood: 'negative' },
  { word: "Fast Shipping", count: 740, mood: 'positive' },
  { word: "Pricey", count: 45, mood: 'neutral' },
  { word: "Design", count: 910, mood: 'positive' },
  { word: "Size Fit", count: 310, mood: 'negative' },
  { word: "Quality", count: 880, mood: 'positive' },
];

export const ORDER_PIPELINE = [
  { id: 'NEW', label: 'New Orders', count: 24, icon: 'ShoppingBag' },
  { id: 'PROC', label: 'Processing', count: 156, icon: 'Loader2' },
  { id: 'SHIP', label: 'Shipped', count: 1042, icon: 'Truck' },
];
