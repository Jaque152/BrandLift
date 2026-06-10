"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  image?: string;
}

export interface CartItem extends ServiceItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: ServiceItem) => void;
  addCustomItem: (item: { id: string; name: string; price: number; description?: string; category?: string; image?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
  ivaAmount: number;
  totalWithIva: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: ServiceItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const addCustomItem = useCallback((item: { id: string; name: string; price: number; description?: string; category?: string; image?: string }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        ...item,
        quantity: 1,
        description: item.description || "Servicio Cotizado",
        category: item.category || "Cotización",
        features: [],
        image: item.image || ""
      }];
    });
  }, []);

  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  // NUEVOS CÁLCULOS
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const ivaAmount = subtotal * 0.16;
  const totalWithIva = subtotal + ivaAmount;

  return (
    <CartContext.Provider value={{
      items, addItem, addCustomItem, removeItem, updateQuantity, clearCart,
      isOpen, openCart, closeCart, totalItems, subtotal, ivaAmount, totalWithIva
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}