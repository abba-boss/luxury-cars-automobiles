import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (vehicle: Omit<CartItem, 'addedAt'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (vehicle: Omit<CartItem, 'addedAt'>) => {
    setItems(prev => {
      // Check if item already exists
      if (prev.find(item => item.id === vehicle.id)) {
        toast({
          title: "Already in Cart",
          description: "This vehicle is already in your cart",
          variant: "destructive"
        });
        return prev;
      }

      const newItem = { ...vehicle, addedAt: new Date() };
      toast({
        title: "Added to Cart",
        description: `${vehicle.year} ${vehicle.make} ${vehicle.model} added to cart`
      });
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const item = prev.find(item => item.id === id);
      if (item) {
        toast({
          title: "Removed from Cart",
          description: `${item.year} ${item.make} ${item.model} removed from cart`
        });
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart"
    });
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return items.length;
  };

  const isInCart = (id: string) => {
    return items.some(item => item.id === id);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getItemCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
