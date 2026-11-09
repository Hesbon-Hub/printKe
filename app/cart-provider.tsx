"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  productSlug: string;
  name: string;
  category: string;
  unitPrice: number | null;
  quantity: number;
  option: string;
};

type NewCartItem = Omit<CartItem, "id">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  estimatedTotal: number;
  hasQuoteItems: boolean;
  isLoaded: boolean;
  addItem: (item: NewCartItem) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "odeon-print-cart-v1";
const MAX_CART_QUANTITY = 9999;
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((item) => item && typeof item.id === "string" && typeof item.quantity === "number"));
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    estimatedTotal: items.reduce((total, item) => total + (item.unitPrice ?? 0) * item.quantity, 0),
    hasQuoteItems: items.some((item) => item.unitPrice === null),
    isLoaded,
    addItem: (item) => {
      const id = `${item.productSlug}:${item.option || "default"}`;
      setItems((current) => {
        const existing = current.find((cartItem) => cartItem.id === id);
        if (!existing) return [...current, { ...item, id, quantity: Math.min(MAX_CART_QUANTITY, item.quantity) }];
        return current.map((cartItem) => cartItem.id === id ? { ...cartItem, quantity: Math.min(MAX_CART_QUANTITY, cartItem.quantity + item.quantity) } : cartItem);
      });
    },
    setQuantity: (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, quantity)) } : item)),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
  }), [items, isLoaded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used within CartProvider");
  return cart;
}