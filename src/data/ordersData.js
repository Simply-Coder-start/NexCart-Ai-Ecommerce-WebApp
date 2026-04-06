export const MOCK_ORDERS = [
  {
    id: '408-1234567-8901234',
    date: '2026-03-31T10:00:00Z', // 31 March 2026
    total: '₹2,750.00',
    status: 'Delivered',
    deliveryDate: '31 March',
    items: [
      {
        id: '64f1a2b3c4d5e6f7g8h9i0a1', // Mocking actual MongoDB IDs for the Buy Again functionality
        title: 'Ultra-HD Smartwatch V2 with Health Tracking & GPS',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=200',
        returnWindow: 'Return window closed on 30 April 2026',
        price: '2750'
      }
    ]
  },
  {
    id: '408-9876543-2109876',
    date: '2026-03-15T14:30:00Z', // 15 March 2026
    total: '₹14,200.00',
    status: 'Delivered',
    deliveryDate: '18 March',
    items: [
      {
        id: '64f1a2b3c4d5e6f7g8h9i0a2',
        title: 'Noise-Cancelling Wireless Headphones (Silver Edition)',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200',
        returnWindow: 'Return window closed on 15 April 2026',
        price: '12500'
      },
      {
        id: '64f1a2b3c4d5e6f7g8h9i0a3',
        title: 'USB-C Fast Charging Cable (2m)',
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200',
        returnWindow: 'Return window closed on 15 April 2026',
        price: '1700'
      }
    ]
  },
  {
    id: '408-5555555-5555555',
    date: '2026-04-10T09:15:00Z', // 10 April 2026 (assuming current date is around April 2026)
    total: '₹899.00',
    status: 'Not Yet Shipped',
    deliveryDate: 'Arriving Tuesday',
    items: [
      {
        id: '64f1a2b3c4d5e6f7g8h9i0a4',
        title: 'Ergonomic Mouse Pad with Wrist Rest',
        image: 'https://images.unsplash.com/photo-1616422320473-b3281dd73c71?q=80&w=200',
        returnWindow: 'Eligible for return until 10 May 2026',
        price: '899'
      }
    ]
  }
];

export const MOCK_RECOMMENDATIONS = [
  {
    id: '64f1a2b3c4d5e6f7g8h9i0r1',
    title: 'Echo Dot (5th Gen) | Smart Speaker with Alexa',
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=200',
    price: '₹4,499',
    discount: '15%'
  },
  {
    id: '64f1a2b3c4d5e6f7g8h9i0r2',
    title: 'Philips Hue Smart Bulb (16 Million Colors)',
    image: 'https://images.unsplash.com/photo-1550985616-1fa5a722659e?q=80&w=200',
    price: '₹1,999',
    discount: '20%'
  },
  {
    id: '64f1a2b3c4d5e6f7g8h9i0r3',
    title: 'Smart WiFi Plug with Energy Tracking',
    image: 'https://images.unsplash.com/photo-1558002038-103792e07a70?q=80&w=200',
    price: '₹999',
    discount: '10%'
  }
];
