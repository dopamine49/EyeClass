import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_CART_KEY = 'eyecare_guest_cart';

function readGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, subtotal: 0, discountTotal: 0, payableTotal: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const response = await api.getCart();
        setCart(response.data);
      } else {
        const guestItems = readGuestCart();
        const mapped = guestItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          imageUrl: item.imageUrl,
          price: item.price,
          oldPrice: item.oldPrice,
          quantity: item.quantity,
          lineTotal: item.price * item.quantity,
        }));

        const totalItems = mapped.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = mapped.reduce((sum, item) => sum + item.lineTotal, 0);
        setCart({ items: mapped, totalItems, subtotal, discountTotal: 0, payableTotal: subtotal });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  useEffect(() => {
    async function mergeGuestCartIntoServer() {
      if (!isAuthenticated) {
        return;
      }
      const guestItems = readGuestCart();
      if (!guestItems.length) {
        return;
      }
      for (const item of guestItems) {
        // eslint-disable-next-line no-await-in-loop
        await api.upsertCartItem({ productId: item.productId, quantity: item.quantity });
      }
      writeGuestCart([]);
      await refreshCart();
    }

    mergeGuestCartIntoServer();
  }, [isAuthenticated]);

  const upsertItem = async (product, quantity) => {
    if (isAuthenticated) {
      const response = await api.upsertCartItem({ productId: product.id || product.productId, quantity });
      setCart(response.data);
      return;
    }

    const productId = product.id || product.productId;
    const guestItems = readGuestCart();
    const index = guestItems.findIndex((item) => item.productId === productId);
    const nextItem = {
      productId,
      productName: product.name || product.productName,
      imageUrl: product.imageUrl,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      quantity,
    };

    if (index >= 0) {
      guestItems[index] = nextItem;
    } else {
      guestItems.push(nextItem);
    }

    writeGuestCart(guestItems);
    await refreshCart();
  };

  const removeItem = async (productId) => {
    if (isAuthenticated) {
      const response = await api.removeCartItem(productId);
      setCart(response.data);
      return;
    }

    const guestItems = readGuestCart().filter((item) => item.productId !== productId);
    writeGuestCart(guestItems);
    await refreshCart();
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await api.clearCart();
    } else {
      writeGuestCart([]);
    }
    await refreshCart();
  };

  const checkout = async (payload) => {
    const response = await api.checkout(payload);
    await refreshCart();
    return response.data;
  };

  const value = useMemo(
    () => ({ cart, loading, refreshCart, upsertItem, removeItem, clearCart, checkout }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
