import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * ProductImage Component
 * Handles missing or broken product images by rendering a sleek fallback UI.
 */
const ProductImage = ({ src, alt, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state if the src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const fallbackClasses = `flex flex-col items-center justify-center bg-[#1a1a24] text-gray-600 ${className}`;

  if (!src || hasError) {
    return (
      <div className={fallbackClasses} id="product-fallback-ui">
        <ImageOff className="w-8 h-8 md:w-10 md:h-10 mb-2 opacity-50" />
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Product Image"}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
};

export default ProductImage;
