import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  restaurantId?: string;
  restaurantName?: string;
  description?: string | null;
};

type AddItemPayload = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  restaurantId?: string;
  restaurantName?: string;
  description?: string | null;
  quantity?: number;
};

type CartStore = {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  addItem: (item: AddItemPayload) => void;
  addToCart: (item: AddItemPayload) => void; // alias for compatibility
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (payload) => {
        const state = get();

        if (state.restaurantId && payload.restaurantId && state.restaurantId !== payload.restaurantId) {
          // One restaurant per cart rule: replace cart.
          set({
            items: [
              {
                ...payload,
                image: payload.image ?? null,
                quantity: payload.quantity ?? 1,
              },
            ],
            restaurantId: payload.restaurantId,
            restaurantName: payload.restaurantName ?? null,
          });
          return;
        }

        const exists = state.items.find((i) => i.id === payload.id);
        if (exists) {
          set({
            items: state.items.map((i) =>
              i.id === payload.id
                ? { ...i, quantity: i.quantity + (payload.quantity ?? 1) }
                : i
            ),
          });
          return;
        }

        set({
          items: [
            ...state.items,
            {
              ...payload,
              image: payload.image ?? null,
              quantity: payload.quantity ?? 1,
            },
          ],
          restaurantId: payload.restaurantId ?? state.restaurantId,
          restaurantName: payload.restaurantName ?? state.restaurantName,
        });
      },

      addToCart: (item) => get().addItem(item),

      removeItem: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        set({
          items,
          ...(items.length === 0 ? { restaurantId: null, restaurantName: null } : {}),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'oishi-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        restaurantId: s.restaurantId,
        restaurantName: s.restaurantName,
      }),
    }
  )
);
