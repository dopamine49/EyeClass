import React, { createContext, useContext, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'eyecare_wishlist';

function readWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const toggleWishlist = (product) => {
    const exists = items.find((item) => item.id === product.id || item.productId === product.id);
    if (exists) {
      persist(items.filter((item) => (item.id || item.productId) !== product.id));
      return false;
    }
    const nextItem = {
      id: product.id || product.productId,
      name: product.name || product.productName,
      price: product.price,
      oldPrice: product.oldPrice || null,
      imageUrl: product.imageUrl,
      category: product.category,
      style: product.style,
      type: product.type,
    };
    persist([nextItem, ...items]);
    return true;
  };

  const isWished = (productId) => items.some((item) => (item.id || item.productId) === productId);

  const clearWishlist = () => persist([]);

  const value = useMemo(
    () => ({ items, toggleWishlist, isWished, clearWishlist }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }
  return context;
}
