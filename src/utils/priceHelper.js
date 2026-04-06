/**
 * Utility for generating category-aware premium prices and formatting them.
 */

const CATEGORY_RANGES = {
  FASHION: { min: 1499, max: 12999 },
  BEAUTY: { min: 899, max: 5499 },
  ELECTRONICS: { min: 4999, max: 89999 },
  'HOME & KITCHEN': { min: 1999, max: 24999 },
  BOOKS: { min: 499, max: 2999 },
  SPORTS: { min: 1299, max: 15499 },
};

/**
 * Generates a random price within a category's premium range.
 * @param {string} category 
 * @returns {string}
 */
export const generatePremiumPrice = (category) => {
  const range = CATEGORY_RANGES[category.toUpperCase()] || { min: 999, max: 9999 };
  const price = Math.random() * (range.max - range.min) + range.min;
  // Round to .00 or .99 for psychological pricing
  const base = Math.floor(price);
  const suffix = Math.random() > 0.5 ? '.00' : '.99';
  return base.toString() + suffix;
};

/**
 * Formats a number or string as INR currency.
 * @param {number|string} price 
 * @returns {string}
 */
export const formatINR = (price) => {
  const value = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};
