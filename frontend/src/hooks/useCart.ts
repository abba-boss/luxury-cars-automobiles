import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Car } from "@/types/car";

interface CartState {
  items: Car[];
  addToCart: (car: Car) => void;
  removeFromCart: (carId: string) => void;
  clearCart: () => void;
  isInCart: (carId: string) => boolean;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (car) => {
        const { items } = get();
        if (!items.find((item) => item.id === car.id)) {
          set({ items: [...items, car] });
        }
      },
      
      removeFromCart: (carId) => {
        set({ items: get().items.filter((item) => item.id !== carId) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      isInCart: (carId) => {
        return get().items.some((item) => item.id === carId);
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      },
    }),
    {
      name: "sarkin-mota-cart",
    }
  )
);
