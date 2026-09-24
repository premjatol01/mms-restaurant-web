"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "menu-order-v1";

const initialMobile = {
  number: "",
  otpSent: false,
  verified: false,
};

const seedReviews = [
  {
    id: "r-seed-1",
    name: "Aarav Mehta",
    rating: 5,
    comment: "Beautiful flavours and the paneer tikka was outstanding.",
    createdAt: "2026-09-16T10:00:00.000Z",
  },
  {
    id: "r-seed-2",
    name: "Priya S.",
    rating: 4,
    comment: "Lovely table service, generous portions and a warm atmosphere.",
    createdAt: "2026-09-11T10:00:00.000Z",
  },
];

/**
 * Core Zustand store. Cart, favorites, the active table order, order
 * history, reviews and the mobile/OTP login are persisted to localStorage
 * so a reload (or a re-scan of the table QR) keeps the session intact.
 * UI-only state (active tab, search query, modal visibility) is kept out
 * of `partialize` below so every visit starts on the Home tab.
 */
export const useMenuOrderStore = create(
  persist(
    (set, get) => ({
      // ---------------------------------------------------------------
      // State
      // ---------------------------------------------------------------
      items: {}, // cart items keyed by id -> { ...item, quantity }
      favorites: [], // array of item ids
      activeTab: "Home",
      selectedCategoryId: 1,
      searchQuery: "",
      isCartExpanded: true,
      tableId: null,

      offersModalOpen: true,
      mobile: initialMobile,
      isOfferApplied: true,

      activeOrder: null, // { id, items:[], total, status, placedAt }
      orderHistory: [], // completed orders, newest first

      reviews: seedReviews,

      // ---------------------------------------------------------------
      // Offer actions
      // ---------------------------------------------------------------
      removeOffer: () => set({ isOfferApplied: false }),
      applyOffer: () => set({ isOfferApplied: true }),

      // ---------------------------------------------------------------
      // Cart actions
      // ---------------------------------------------------------------
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items[item.id];
          return {
            items: {
              ...state.items,
              [item.id]: {
                ...item,
                quantity: (existing?.quantity ?? 0) + quantity,
              },
            },
          };
        }),

      setQuantity: (id, quantity) =>
        set((state) => {
          const existing = state.items[id];
          if (!existing) return {};
          if (quantity <= 0) {
            const { [id]: _removed, ...rest } = state.items;
            return { items: rest };
          }
          return { items: { ...state.items, [id]: { ...existing, quantity } } };
        }),

      increment: (item) => get().addItem(item, 1),

      decrement: (id) => {
        const current = get().items[id]?.quantity ?? 0;
        get().setQuantity(id, current - 1);
      },

      removeItem: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.items;
          return { items: rest };
        }),

      clearCart: () => set({ items: {} }),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
        })),

      // ---------------------------------------------------------------
      // Navigation / UI state
      // ---------------------------------------------------------------
      setActiveTab: (tab) => set({ activeTab: tab, isCartExpanded: true }),
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCartExpanded: (value) => set({ isCartExpanded: value }),
      setTableId: (id) => set({ tableId: id }),

      // ---------------------------------------------------------------
      // Offers modal / mobile OTP login (shared by the modal, Cart and
      // Offers & Rewards so verification state stays in sync everywhere)
      // ---------------------------------------------------------------
      openOffersModal: () => set({ offersModalOpen: true }),
      closeOffersModal: () => set({ offersModalOpen: false }),

      setMobileNumber: (number) =>
        set((state) => ({ mobile: { ...state.mobile, number } })),

      sendOtp: () => {
        const { number } = get().mobile;
        if (!/^[6-9]\d{9}$/.test(number)) {
          return { ok: false, error: "Enter a valid 10-digit mobile number" };
        }
        set((state) => ({ mobile: { ...state.mobile, otpSent: true } }));
        return { ok: true };
      },

      verifyOtp: (code) => {
        if (!code || code.trim().length < 4) {
          return { ok: false, error: "Enter the 4-digit code sent on WhatsApp" };
        }
        set((state) => ({
          mobile: { ...state.mobile, verified: true },
          offersModalOpen: false,
        }));
        return { ok: true };
      },

      skipLogin: () => set({ offersModalOpen: false }),

      logoutMobile: () => set({ mobile: initialMobile }),

      // ---------------------------------------------------------------
      // Orders — placing an order moves cart items into (or merges them
      // into) the table's single active order, matching the "everyone at
      // this table shares one session" copy used across the app.
      // ---------------------------------------------------------------
      placeOrder: () => {
        const { items } = get();
        const cartItems = Object.values(items);
        if (cartItems.length === 0) return { ok: false, error: "Your cart is empty" };

        const orderItems = cartItems.map(({ id, title, price, quantity, imageUrl }) => ({
          id,
          title,
          price,
          quantity,
          imageUrl,
        }));

        set((state) => {
          if (state.activeOrder) {
            const merged = new Map(
              state.activeOrder.items.map((entry) => [entry.id, { ...entry }])
            );
            orderItems.forEach((entry) => {
              const existing = merged.get(entry.id);
              merged.set(
                entry.id,
                existing
                  ? { ...existing, quantity: existing.quantity + entry.quantity }
                  : entry
              );
            });
            const mergedItems = Array.from(merged.values());
            return {
              items: {},
              isCartExpanded: true,
              activeOrder: {
                ...state.activeOrder,
                items: mergedItems,
                total: mergedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                status: "received",
              },
            };
          }

          return {
            items: {},
            isCartExpanded: true,
            activeOrder: {
              id: `ORD-${Date.now().toString().slice(-6)}`,
              items: orderItems,
              total: orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
              status: "received",
              placedAt: new Date().toISOString(),
            },
          };
        });

        // Lightweight kitchen-progress simulation for a realistic demo.
        setTimeout(() => {
          set((state) =>
            state.activeOrder?.status === "received"
              ? { activeOrder: { ...state.activeOrder, status: "preparing" } }
              : {}
          );
        }, 5000);
        setTimeout(() => {
          set((state) =>
            state.activeOrder?.status === "preparing"
              ? { activeOrder: { ...state.activeOrder, status: "ready" } }
              : {}
          );
        }, 11000);

        return { ok: true };
      },

      completeActiveOrder: () =>
        set((state) => {
          if (!state.activeOrder) return {};
          const completed = {
            ...state.activeOrder,
            status: "Completed",
            completedAt: new Date().toISOString(),
          };
          return {
            activeOrder: null,
            orderHistory: [completed, ...state.orderHistory],
          };
        }),

      reorder: (order) => {
        order.items.forEach((entry) => get().addItem(entry, entry.quantity));
        set({ activeTab: "Cart" });
      },

      // ---------------------------------------------------------------
      // Reviews
      // ---------------------------------------------------------------
      submitReview: ({ name, rating, comment }) =>
        set((state) => ({
          reviews: [
            {
              id: `r-${Date.now()}`,
              name: name?.trim() || "Guest",
              rating,
              comment: comment?.trim() || "",
              createdAt: new Date().toISOString(),
            },
            ...state.reviews,
          ],
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Rehydrate manually (see HydrateStore in menu/layout.jsx) so the
      // server-rendered markup and the first client render always match.
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        favorites: state.favorites,
        mobile: state.mobile,
        activeOrder: state.activeOrder,
        orderHistory: state.orderHistory,
        reviews: state.reviews,
        isOfferApplied: state.isOfferApplied,
      }),
    }
  )
);

/**
 * Convenience hook that mirrors the previous Context API's shape so most
 * components only need to swap their import. It subscribes to the whole
 * store (same trade-off the old Context provider made — any change
 * re-renders consumers) and adds the derived cart totals + a couple of
 * lookup helpers on top.
 */
export function useMenuOrder() {
  const state = useMenuOrderStore();

  const cartItems = Object.values(state.items);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const mrpTotal = cartItems.reduce(
    (sum, i) => sum + (i.mrp ?? i.price) * i.quantity,
    0
  );

  return {
    ...state,
    cartItems,
    totalItems,
    subtotal,
    mrpTotal,
    hasDiscount: mrpTotal > subtotal,
    getQuantity: (id) => state.items[id]?.quantity ?? 0,
    isFavorite: (id) => state.favorites.includes(id),
  };
}
