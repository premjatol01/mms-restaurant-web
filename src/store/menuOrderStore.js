"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "menu-order-v1";

const initialMobile = {
  number: "",
  otpSent: false,
  verified: false,
};

function sanitizeOrderHistory(history) {
  if (!Array.isArray(history)) return [];
  const seen = new Set();
  return history.filter((order) => {
    if (!order) return false;
    const key = order.sessionId || order.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Derives completed orders strictly belonging to the active table session.
 * Never leaks previous session orders into a new session.
 */
function deriveSessionOrderHistory(orders) {
  if (!Array.isArray(orders)) return [];
  return orders
    .filter((o) =>
      (o.items || []).every(
        (i) => i.status === "served" || i.status === "cancelled"
      )
    )
    .map((o) => ({
      id: o.orderNumber ? `ORD-${o.orderNumber.replace("#", "")}` : String(o._id || o.id),
      sessionId: o.sessionId,
      items: (o.items || [])
        .filter((i) => (i.quantity || 0) - (i.cancelledQty || 0) > 0)
        .map((i) => ({
          id: i.menuItemId || i._id || i.name,
          title: i.name,
          name: i.name,
          price: i.price,
          quantity: (i.quantity || 0) - (i.cancelledQty || 0),
          imageUrl: i.imageUrl || "",
        })),
      total: o.total,
      subtotal: o.subtotal,
      discount: o.discount || 0,
      status: "Completed",
      placedAt: o.createdAt,
      completedAt: o.updatedAt,
    }))
    .filter((o) => o.items.length > 0);
}

/**
 * Derives the active order for the Current Order section.
 * Represents a single specific order (not all orders across the entire session).
 * By default selects the latest in-progress order (or latest order placed),
 * or the order specified by selectedOrderId.
 */
function deriveActiveOrder(session, orders, acknowledgedOrderIds = [], selectedOrderId = null) {
  if (!session || !orders || !Array.isArray(orders) || orders.length === 0) return null;

  // Filter valid live orders (ignore completely cancelled orders)
  const validOrders = orders.filter((o) => {
    if (!o) return false;
    if (o.status === "cancelled") return false;
    const hasLiveItems = (o.items || []).some(
      (i) => Math.max(0, (i.quantity || 0) - (i.cancelledQty || 0)) > 0
    );
    return hasLiveItems;
  });

  if (validOrders.length === 0) return null;

  // Find target order
  let targetOrder = null;
  if (selectedOrderId) {
    targetOrder = validOrders.find(
      (o) => String(o._id || o.id) === String(selectedOrderId)
    );
  }

  if (!targetOrder) {
    // Pick the latest in-progress order (i.e. not yet fully served, or served but not acknowledged)
    const inProgressOrders = validOrders.filter((o) => {
      const liveItems = (o.items || []).filter(
        (i) => Math.max(0, (i.quantity || 0) - (i.cancelledQty || 0)) > 0
      );
      const isServed = liveItems.length > 0 && liveItems.every((i) => i.status === "served");
      const isAcked = (acknowledgedOrderIds || []).includes(String(o._id || o.id));
      return liveItems.length > 0 && (!isServed || !isAcked);
    });

    if (inProgressOrders.length > 0) {
      targetOrder = inProgressOrders[inProgressOrders.length - 1];
    } else {
      // If all orders are delivered/served, show the latest order placed
      targetOrder = validOrders[validOrders.length - 1];
    }
  }

  if (!targetOrder) return null;

  // Extract ONLY the items belonging to this particular order
  const orderItems = (targetOrder.items || [])
    .filter((i) => Math.max(0, (i.quantity || 0) - (i.cancelledQty || 0)) > 0)
    .map((item) => {
      const liveQty = Math.max(0, (item.quantity || 0) - (item.cancelledQty || 0));
      return {
        id: item._id || item.id || item.menuItemId || item.name,
        _id: item._id || item.id,
        menuItemId: item.menuItemId,
        title: item.name || item.title,
        name: item.name || item.title,
        price: Number(item.price) || 0,
        quantity: liveQty,
        imageUrl: item.imageUrl || "",
        status: item.status || "pending",
      };
    });

  if (orderItems.length === 0) return null;

  // Determine timeline status for this particular order
  let orderStatus = "ready";
  if (orderItems.some((i) => i.status === "pending")) {
    orderStatus = "received";
  } else if (orderItems.some((i) => i.status === "processing")) {
    orderStatus = "preparing";
  } else {
    // All items served
    const isAcked = (acknowledgedOrderIds || []).includes(String(targetOrder._id || targetOrder.id));
    if (isAcked) {
      orderStatus = "delivered";
    } else {
      orderStatus = "ready";
    }
  }

  // Calculate this particular order's subtotal and total
  const orderSubtotal = targetOrder.subtotal !== undefined
    ? Number(targetOrder.subtotal)
    : orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const orderDiscount = Number(targetOrder.discount) || 0;
  const orderTotal = targetOrder.total !== undefined
    ? Number(targetOrder.total)
    : Math.max(0, orderSubtotal - orderDiscount);

  // Find round number index in the whole session
  const orderIndex = orders.findIndex(
    (o) => String(o._id || o.id) === String(targetOrder._id || targetOrder.id)
  );
  const roundNumber = orderIndex >= 0 ? orderIndex + 1 : 1;

  return {
    id: targetOrder.orderNumber
      ? `ORD-${targetOrder.orderNumber.replace("#", "")}`
      : String(targetOrder._id || targetOrder.id),
    orderId: String(targetOrder._id || targetOrder.id),
    orderNumber: targetOrder.orderNumber || `#${roundNumber}`,
    roundNumber,
    sessionId: targetOrder.sessionId || session._id,
    items: orderItems,
    subtotal: orderSubtotal,
    discount: orderDiscount,
    total: orderTotal,
    appliedOffer: targetOrder.appliedOffer || null,
    status: orderStatus,
    placedAt: targetOrder.createdAt || session.startedAt,
    totalRounds: orders.length,
  };
}

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
      tableName: null,
      verifiedRestaurant: null,
      verifiedTable: null,
      verificationStatus: "idle", // 'idle' | 'loading' | 'success' | 'error'
      verificationError: null,

      currentSession: null, // live active table session from backend
      sessionOrders: [], // all orders placed during this session
      selectedOrderId: null, // ID of the specific order currently being viewed/tracked
      activeOrder: null, // derived active order view for that specific order
      acknowledgedOrderIds: [], // IDs of served orders acknowledged by customer ("I've received my order")
      orderHistory: [], // completed historical orders
      isSubmittingOrder: false,

      // Live menu data fetched from the restaurant's dashboard
      categories: [],
      menuItems: [],
      combos: [],
      offers: [],
      menuLoading: false,

      offersModalOpen: false,
      offersModalContext: "offers",
      mobile: initialMobile,
      appliedOffer: null,
      isOfferApplied: false,

      reviews: [],
      reviewsLoading: false,

      // ---------------------------------------------------------------
      // Offer actions
      // ---------------------------------------------------------------
      setAppliedOffer: (offer) => set({ appliedOffer: offer, isOfferApplied: true }),
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

      handleFavoritesUpdated: (favorites) =>
        set({ favorites: Array.isArray(favorites) ? favorites.map(String) : [] }),

      toggleFavorite: async (id) => {
        if (!id) return;
        const itemId = String(id);
        const previousFavorites = get().favorites || [];
        const isCurrentlyFav = previousFavorites.some((favId) => String(favId) === itemId);
        const nextFavorites = isCurrentlyFav
          ? previousFavorites.filter((favId) => String(favId) !== itemId)
          : [...previousFavorites, itemId];

        // Optimistic update so UI reflects immediately
        set({ favorites: nextFavorites });

        const state = get();
        const subdomain =
          state.verifiedRestaurant?.subdomain ||
          (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "");
        const tableId =
          state.verifiedTable?.tableId ||
          state.verifiedTable?.id ||
          state.verifiedTable?._id ||
          state.tableId;
        const sessionId = state.currentSession?._id;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        try {
          const res = await fetch(`${apiUrl}/orders/public/session/favorite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subdomain,
              tableId,
              sessionId,
              itemId,
            }),
          });
          const json = await res.json().catch(() => null);

          if (res.ok && json?.success && json?.data) {
            set((s) => ({
              favorites: Array.isArray(json.data.favorites)
                ? json.data.favorites.map(String)
                : s.favorites,
              currentSession:
                !s.currentSession && json.data.sessionId
                  ? { _id: json.data.sessionId, status: "active", favorites: json.data.favorites }
                  : s.currentSession
                  ? { ...s.currentSession, favorites: json.data.favorites }
                  : null,
            }));
          } else {
            // Rollback optimistic update on server error
            set({ favorites: previousFavorites });
          }
        } catch (err) {
          console.error("Error toggling favorite on server:", err);
          // Rollback on network failure
          set({ favorites: previousFavorites });
        }
      },

      // ---------------------------------------------------------------
      // Navigation / UI state
      // ---------------------------------------------------------------
      setActiveTab: (tab) => set({ activeTab: tab, isCartExpanded: true }),
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCartExpanded: (value) => set({ isCartExpanded: value }),
      setTableId: (id) => set({ tableId: id }),
      setTableName: (name) => set({ tableName: name }),

      setSelectedOrderId: (id) => {
        const cleanId = id ? String(id) : null;
        const { currentSession, sessionOrders, acknowledgedOrderIds = [] } = get();
        const derived = deriveActiveOrder(currentSession, sessionOrders, acknowledgedOrderIds, cleanId);
        set({
          selectedOrderId: cleanId,
          activeOrder: derived,
        });
      },

      setVerifiedSession: ({ restaurant, table, session, orders }) => {
        const acknowledgedIds = get().acknowledgedOrderIds || [];
        const previousSessionId = get().currentSession?._id;
        const currentSessionId = session?._id;
        const isNewSession = !currentSessionId || (previousSessionId && String(previousSessionId) !== String(currentSessionId));
        const selectedId = isNewSession ? null : get().selectedOrderId;
        const derived = deriveActiveOrder(session, orders, acknowledgedIds, selectedId);
        const sessionMobile = session?.customerMobile;
        const sessionOffer = session?.appliedOffer || (orders || []).find((o) => o.appliedOffer)?.appliedOffer || null;

        // If session already has a customer mobile, link it as verified; otherwise clean initialMobile
        const resolvedMobile = sessionMobile
          ? {
              number: sessionMobile,
              otpSent: true,
              verified: true,
              name: session.customerName || "",
            }
          : initialMobile;

        // When a customer scans QR and session is new (no mobile yet), prompt verify popup!
        const shouldOpenOffersModal = !sessionMobile;

        // Derive completed order history strictly from the current table session's orders
        const sessionHistory = deriveSessionOrderHistory(orders);

        // Resolve friendly table name configured by restaurant admin
        const resolvedTableName =
          table?.tableName ||
          table?.tableNo ||
          table?.name ||
          (table?.tableId && table.tableId.length !== 24 ? table.tableId : null);

        set({
          verifiedRestaurant: restaurant,
          verifiedTable: table,
          tableId: table?.id || table?.tableId || table?._id || null,
          tableName: resolvedTableName || get().tableName || null,
          currentSession: session || null,
          sessionOrders: orders || [],
          selectedOrderId: selectedId || (derived ? derived.orderId : null),
          activeOrder: derived,
          orderHistory: sessionHistory,
          items: isNewSession ? {} : get().items,
          favorites: session?.favorites ? session.favorites.map(String) : [],
          acknowledgedOrderIds: isNewSession ? [] : acknowledgedIds,
          mobile: resolvedMobile,
          appliedOffer: sessionOffer || null,
          isOfferApplied: Boolean(sessionOffer),
          offersModalOpen: shouldOpenOffersModal,
          verificationStatus: "success",
          verificationError: null,
        });
      },

      setVerificationError: (err) =>
        set({
          verificationStatus: "error",
          verificationError: err,
        }),

      setVerificationLoading: () =>
        set({
          verificationStatus: "loading",
          verificationError: null,
        }),

      updateLiveSession: (session, orders) => {
        const acknowledgedIds = get().acknowledgedOrderIds || [];
        const selectedId = get().selectedOrderId;
        const derived = deriveActiveOrder(session, orders, acknowledgedIds, selectedId);
        const sessionMobile = session?.customerMobile;
        const sessionOffer = session?.appliedOffer || (orders || []).find((o) => o.appliedOffer)?.appliedOffer || null;
        const sessionHistory = deriveSessionOrderHistory(orders);

        set((state) => ({
          currentSession: session || null,
          sessionOrders: orders || [],
          selectedOrderId: selectedId || (derived ? derived.orderId : null),
          activeOrder: derived,
          orderHistory: sessionHistory,
          favorites: session?.favorites !== undefined ? (session.favorites || []).map(String) : state.favorites,
          mobile: sessionMobile
            ? {
                number: sessionMobile,
                otpSent: true,
                verified: true,
                name: session.customerName || state.mobile?.name || "",
              }
            : state.mobile?.verified ? state.mobile : initialMobile,
          appliedOffer: sessionOffer || state.appliedOffer,
          isOfferApplied: Boolean(sessionOffer || state.isOfferApplied),
          offersModalOpen: sessionMobile ? false : state.offersModalOpen,
        }));
      },

      handleCustomerSynced: (data) => {
        const syncMobile = data?.customerMobile;
        if (!syncMobile) return;
        set((state) => ({
          favorites: Array.isArray(data.favorites) ? data.favorites.map(String) : state.favorites,
          mobile: {
            ...state.mobile,
            number: syncMobile,
            otpSent: true,
            verified: true,
            name: data.customerName || state.mobile?.name || "",
          },
          appliedOffer: data.appliedOffer || state.appliedOffer,
          isOfferApplied: Boolean(data.appliedOffer || state.isOfferApplied),
          offersModalOpen: false,
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                customerMobile: syncMobile,
                customerName: data.customerName || state.currentSession.customerName,
                appliedOffer: data.appliedOffer || state.currentSession.appliedOffer,
              }
            : state.currentSession,
        }));
      },

      endLiveSession: () => {
        set({
          currentSession: null,
          sessionOrders: [],
          selectedOrderId: null,
          activeOrder: null,
          acknowledgedOrderIds: [],
          orderHistory: [],
          items: {},
          favorites: [],
          mobile: initialMobile,
          appliedOffer: null,
          isOfferApplied: false,
        });
      },

      // ---------------------------------------------------------------
      // Polling & Live Session Sync
      // ---------------------------------------------------------------
      pollTableSession: async (subdomain, tableId) => {
        const resolvedSubdomain = subdomain || get().verifiedRestaurant?.subdomain;
        const resolvedTableId =
          tableId ||
          get().verifiedTable?.tableId ||
          get().verifiedTable?.id ||
          get().tableId;
        if (!resolvedSubdomain || !resolvedTableId) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        try {
          const res = await fetch(
            `${apiUrl}/orders/public/session/${encodeURIComponent(resolvedSubdomain)}/${encodeURIComponent(resolvedTableId)}`,
            { cache: "no-store" }
          );
          const json = await res.json().catch(() => null);

          if (res.ok && json?.success) {
            const { session, orders } = json.data;

            // If session is null, cashier has ended/paid the session!
            if (!session) {
              if (get().currentSession) {
                // Table is freed
                get().endLiveSession();
              }
            } else {
              const acknowledgedIds = get().acknowledgedOrderIds || [];
              const selectedId = get().selectedOrderId;
              const derived = deriveActiveOrder(session, orders, acknowledgedIds, selectedId);
              set({
                currentSession: session,
                sessionOrders: orders || [],
                selectedOrderId: selectedId || (derived ? derived.orderId : null),
                activeOrder: derived,
                favorites: session.favorites !== undefined ? (session.favorites || []).map(String) : get().favorites,
              });
            }
          }
        } catch (err) {
          // Polling fails silently
        }
      },

      // ---------------------------------------------------------------
      // Fetch Live Menu Data (Categories, Items, Combos) from Dashboard
      // ---------------------------------------------------------------
      fetchMenuData: async (subdomain) => {
        const resolvedSubdomain = subdomain || get().verifiedRestaurant?.subdomain;
        if (!resolvedSubdomain) return;

        set({ menuLoading: true });
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const baseUrl = apiUrl.replace("/api", "");

        const resolveImage = (img, fallback = "") => {
          if (!img) return fallback;
          if (img.startsWith("http") || img.startsWith("data:") || img.startsWith("blob:")) return img;
          return `${baseUrl}${img.startsWith("/") ? "" : "/"}${img}`;
        };

        try {
          const res = await fetch(
            `${apiUrl}/menu/public/${encodeURIComponent(resolvedSubdomain)}`,
            { cache: "no-store" }
          );
          const json = await res.json().catch(() => null);

          if (res.ok && json?.success) {
            const rawCategories = json.data?.categories || [];
            const rawItems = json.data?.items || [];
            const rawCombos = json.data?.combos || [];
            const rawOffers = json.data?.offers || [];

            const EMOJIS = ["🍕", "🍔", "☕", "🍜", "🥗", "🍰", "🥤", "🍱", "🍛", "🌮", "🍦", "🥪"];

            const categories = rawCategories.map((cat, idx) => ({
              id: cat._id || cat.id,
              _id: cat._id || cat.id,
              name: cat.name,
              description: cat.description || "",
              image: resolveImage(cat.image, ""),
              imageUrl: resolveImage(cat.image, ""),
              emoji: EMOJIS[idx % EMOJIS.length],
              itemCount: rawItems.filter(
                (i) =>
                  String(i.categoryId?._id || i.categoryId) ===
                  String(cat._id || cat.id)
              ).length,
              status: cat.status,
              isTopCategory: Boolean(cat.isTopCategory),
            }));

            const menuItems = rawItems.map((item) => ({
              id: item._id || item.id,
              _id: item._id || item.id,
              title: item.name || item.title,
              name: item.name || item.title,
              price: Number(item.price) || 0,
              mrp: Number(item.mrp) || Number(item.price) || 0,
              categoryId: item.categoryId?._id
                ? String(item.categoryId._id)
                : item.categoryId
                ? String(item.categoryId)
                : "",
              description: item.description || "",
              imageUrl: resolveImage(
                item.image,
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"
              ),
              foodType: item.foodType || "veg",
              isPopular: !!item.isPopular,
              isBestseller: !!item.isBestseller || !!item.isPopular,
              status: item.status,
            }));

            const combos = rawCombos.map((combo) => ({
              id: combo._id || combo.id,
              _id: combo._id || combo.id,
              title: combo.name || combo.title,
              name: combo.name || combo.title,
              price: Number(combo.price) || 0,
              mrp:
                Number(combo.mrp) ||
                (Number(combo.price) ? Number(combo.price) + 100 : 0),
              badge: combo.badge || "SAVE MORE",
              imageUrl: resolveImage(
                combo.image,
                "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80"
              ),
              description: combo.description || "",
              itemIds: combo.itemIds || [],
              status: combo.status,
            }));

            const currentSelected = get().selectedCategoryId;
            const validCategory = categories.some(
              (c) => String(c.id) === String(currentSelected)
            );

            // Default to the first top category, or first category
            const defaultCategory =
              categories.find((c) => c.isTopCategory)?.id ||
              categories[0]?.id ||
              null;

            set({
              categories,
              menuItems,
              combos,
              offers: rawOffers,
              selectedCategoryId: validCategory
                ? currentSelected
                : defaultCategory,
              menuLoading: false,
            });
          } else {
            set({ menuLoading: false });
          }
        } catch (err) {
          console.error("Failed to fetch public menu:", err);
          set({ menuLoading: false });
        }
      },

      // ---------------------------------------------------------------
      // Offers modal / mobile OTP login
      // ---------------------------------------------------------------
      openOffersModal: (context = "offers") =>
        set({ offersModalOpen: true, offersModalContext: context }),
      closeOffersModal: () =>
        set({ offersModalOpen: false, offersModalContext: "offers" }),
      setOffersModalContext: (context) => set({ offersModalContext: context }),

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

      syncCustomerSession: async ({ mobile, name } = {}) => {
        const rawNumber = mobile || get().mobile?.number;
        if (!rawNumber) return { ok: false, error: "Mobile number is required" };

        const cleanMobile = String(rawNumber).replace(/\D/g, "").slice(-10);
        if (cleanMobile.length !== 10) {
          return { ok: false, error: "Please enter a valid 10-digit mobile number" };
        }

        const subdomain = get().verifiedRestaurant?.subdomain;
        const tableId =
          get().verifiedTable?.tableId ||
          get().verifiedTable?.id ||
          get().tableId;
        const sessionId = get().currentSession?._id;

        const appliedOffer = get().appliedOffer;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        try {
          const res = await fetch(`${apiUrl}/orders/public/session/sync-customer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subdomain,
              tableId,
              sessionId,
              mobile: cleanMobile,
              name: name || get().mobile?.name || undefined,
              appliedOffer: appliedOffer || undefined,
            }),
          });

          const json = await res.json().catch(() => null);

          if (res.ok && json?.success) {
            set((state) => ({
              favorites: Array.isArray(json.data?.favorites) ? json.data.favorites.map(String) : state.favorites,
              mobile: {
                ...state.mobile,
                number: cleanMobile,
                otpSent: true,
                verified: true,
                name: name || state.mobile?.name || json.data?.customerName || "",
                customerData: json.data?.customer || null,
              },
              appliedOffer: json.data?.appliedOffer || state.appliedOffer,
              isOfferApplied: Boolean(json.data?.appliedOffer || state.isOfferApplied),
              currentSession: state.currentSession
                ? {
                    ...state.currentSession,
                    customerMobile: cleanMobile,
                    customerName: name || json.data?.customerName || state.currentSession.customerName,
                    customerId: json.data?.customer?.id || state.currentSession.customerId,
                    appliedOffer: json.data?.appliedOffer || state.currentSession.appliedOffer,
                  }
                : state.currentSession,
              offersModalOpen: false,
            }));
            return { ok: true, data: json.data };
          } else {
            return { ok: false, error: json?.message || "Failed to link mobile number with session." };
          }
        } catch (err) {
          console.error("Error syncing customer to session:", err);
          return { ok: false, error: "Network error syncing mobile number." };
        }
      },

      verifyOtp: async (code) => {
        if (!code || code.trim().length < 4) {
          return { ok: false, error: "Enter the 4-digit code sent on WhatsApp" };
        }
        set((state) => ({
          mobile: { ...state.mobile, verified: true },
          offersModalOpen: false,
        }));
        // Sync customer mobile to active session and Customer collection
        return await get().syncCustomerSession();
      },

      skipLogin: () => set({ offersModalOpen: false }),

      logoutMobile: () => set({ mobile: initialMobile }),

      // ---------------------------------------------------------------
      // Place Order: Posts to live backend API & links to table session
      // ---------------------------------------------------------------
      placeOrder: async ({ subdomain, tableId, mobile } = {}) => {
        const {
          items,
          appliedOffer,
          isOfferApplied,
          verifiedRestaurant,
          verifiedTable,
        } = get();
        const cartItems = Object.values(items);
        if (cartItems.length === 0) return { ok: false, error: "Your cart is empty" };

        set({ isSubmittingOrder: true });

        const resolvedSubdomain = subdomain || verifiedRestaurant?.subdomain;
        const resolvedTableId =
          tableId ||
          verifiedTable?.tableId ||
          verifiedTable?.id ||
          get().tableId;

        const subtotal = cartItems.reduce(
          (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
          0
        );

        let discount = 0;
        if (isOfferApplied && appliedOffer) {
          if (appliedOffer.benefit?.type === "flat") {
            discount = Math.min(Number(appliedOffer.benefit.value) || 0, subtotal);
          } else {
            const pct = Number(appliedOffer.benefit?.value) || 0;
            discount = Math.round(((subtotal * pct) / 100) * 100) / 100;
          }
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        try {
          const res = await fetch(`${apiUrl}/orders/public/place-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subdomain: resolvedSubdomain,
              tableId: resolvedTableId,
              items: cartItems.map(
                ({ id, title, name, price, quantity, imageUrl }) => ({
                  id,
                  title: title || name,
                  price,
                  quantity,
                  imageUrl,
                })
              ),
              mobile:
                mobile ||
                (get().mobile?.verified
                  ? get().mobile.number
                  : get().mobile?.number || null),
              appliedOffer: isOfferApplied ? appliedOffer : null,
              discount,
            }),
          });

          const json = await res.json().catch(() => null);

          if (!res.ok || !json?.success) {
            set({ isSubmittingOrder: false });
            return {
              ok: false,
              error: json?.message || "Failed to place order. Please try again.",
            };
          }

          const { session, orders, order } = json.data;
          const acknowledgedIds = get().acknowledgedOrderIds || [];
          const newOrderId = order?._id
            ? String(order._id)
            : (orders && orders.length > 0 ? String(orders[orders.length - 1]._id || orders[orders.length - 1].id) : null);
          const derived = deriveActiveOrder(session, orders, acknowledgedIds, newOrderId);

          set({
            items: {},
            isCartExpanded: true,
            currentSession: session,
            sessionOrders: orders,
            selectedOrderId: newOrderId,
            activeOrder: derived,
            isSubmittingOrder: false,
          });

          return { ok: true, data: json.data };
        } catch (err) {
          console.error("Error placing order:", err);
          set({ isSubmittingOrder: false });
          return {
            ok: false,
            error: "Network error. Please check your connection and try again.",
          };
        }
      },

      completeActiveOrder: (targetOrderId) => {
        const { currentSession, sessionOrders, activeOrder, acknowledgedOrderIds = [], selectedOrderId } = get();

        // If no active session (mock/demo fallback):
        if (!currentSession) {
          if (!activeOrder) return;
          const completed = {
            ...activeOrder,
            status: "Completed",
            completedAt: new Date().toISOString(),
          };
          set((state) => ({
            activeOrder: null,
            orderHistory: sanitizeOrderHistory([completed, ...state.orderHistory]),
          }));
          return;
        }

        // Live table session: acknowledge specific order as received/delivered
        const orderIdToAck = targetOrderId || activeOrder?.orderId || selectedOrderId;
        const updatedAcknowledged = orderIdToAck
          ? Array.from(new Set([...acknowledgedOrderIds, String(orderIdToAck)]))
          : acknowledgedOrderIds;

        const derived = deriveActiveOrder(currentSession, sessionOrders, updatedAcknowledged, selectedOrderId);
        const currentCompleted = deriveSessionOrderHistory(sessionOrders);

        set({
          acknowledgedOrderIds: updatedAcknowledged,
          activeOrder: derived,
          orderHistory: currentCompleted,
        });
      },

      reorder: (order) => {
        order.items.forEach((entry) => get().addItem(entry, entry.quantity));
        set({ activeTab: "Cart" });
      },

      // ---------------------------------------------------------------
      // Reviews
      // ---------------------------------------------------------------
      fetchPublicReviews: async (subdomain) => {
        if (!subdomain) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        try {
          const res = await fetch(`${apiUrl}/reviews/public/${subdomain}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            set({ reviews: json.data });
          }
        } catch (err) {
          console.warn("Could not fetch public reviews:", err);
        }
      },

      submitReview: async ({ name, rating, comment, mobileNumber, subdomain }) => {
        const state = get();
        const resolvedSubdomain = subdomain || state.verifiedRestaurant?.subdomain || (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "");
        const resolvedMobile = mobileNumber || (state.mobile?.verified ? state.mobile.number : "");

        if (!resolvedMobile) {
          return { ok: false, error: "Mobile number is required to submit a review." };
        }

        const rawTable = state.verifiedTable?.tableName || state.verifiedTable?.tableNo || state.verifiedTable?.name || state.tableName || "";

        const payload = {
          subdomain: resolvedSubdomain,
          restaurantId: state.verifiedRestaurant?._id || state.verifiedRestaurant?.id,
          tableId: state.tableId || state.verifiedTable?._id || state.verifiedTable?.id,
          tableName: rawTable,
          sessionId: state.currentSession?._id,
          customerName: name ? name.trim() : (state.mobile?.name || ""),
          customerMobile: resolvedMobile,
          rating: Number(rating),
          comment: comment ? comment.trim() : ""
        };

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        try {
          const res = await fetch(`${apiUrl}/reviews/public`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          if (!json.success) {
            return { ok: false, error: json.message || "Failed to submit review" };
          }

          // Prepend to local reviews for instant visual gratification
          const newReview = {
            id: json.data?.id || `r-${Date.now()}`,
            name: name?.trim() || `User ${resolvedMobile.slice(-4)}`,
            rating: Number(rating),
            comment: comment?.trim() || "",
            createdAt: new Date().toISOString()
          };

          set((s) => ({
            reviews: [newReview, ...s.reviews]
          }));

          return { ok: true, data: json.data };
        } catch (err) {
          console.error("Error submitting review:", err);
          return { ok: false, error: "Network error while submitting review." };
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
        // favorites, mobile, reviews & orderHistory are strictly table-session scoped and fetched live, NEVER persisted across sessions in localStorage
        isOfferApplied: state.isOfferApplied,
        appliedOffer: state.appliedOffer,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Guarantee clean initial state on startup/refresh: no stale mobile, reviews, favorites, or previous orders
          state.mobile = initialMobile;
          state.orderHistory = [];
          state.acknowledgedOrderIds = [];
          state.reviews = [];
          state.reviewsLoading = false;
          state.favorites = [];
        }
      },
    }
  )
);

export function useMenuOrder() {
  const state = useMenuOrderStore();

  const cartItems = useMemo(
    () => Object.values(state.items || {}),
    [state.items]
  );
  const totalItems = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );
  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems]
  );
  const mrpTotal = useMemo(
    () => cartItems.reduce(
      (sum, i) => sum + (i.mrp ?? i.price) * i.quantity,
      0
    ),
    [cartItems]
  );

  let offerDiscount = 0;
  if (state.isOfferApplied && state.appliedOffer && subtotal > 0) {
    const benefit = state.appliedOffer.benefit;
    if (benefit?.type === "flat") {
      offerDiscount = Math.min(Number(benefit.value) || 0, subtotal);
    } else {
      const pct = Number(benefit?.value) || 0;
      offerDiscount = Math.round(((subtotal * pct) / 100) * 100) / 100;
    }
  }

  const finalTotal = Math.max(0, subtotal - offerDiscount);

  const getItemsByCategory = (catId) =>
    (state.menuItems || []).filter(
      (i) => String(i.categoryId) === String(catId)
    );

  const getItemById = (id) =>
    (state.menuItems || []).find(
      (i) => String(i.id) === String(id) || String(i._id) === String(id)
    );

  const bestsellerItems = (state.menuItems || []).filter(
    (i) => i.isBestseller || i.isPopular
  );

  return {
    ...state,
    selectedOrderId: state.selectedOrderId,
    selectActiveOrder: state.setSelectedOrderId,
    cartItems,
    totalItems,
    subtotal,
    mrpTotal,
    offerDiscount,
    finalTotal,
    hasDiscount: mrpTotal > subtotal || offerDiscount > 0,
    getQuantity: (id) => state.items[id]?.quantity ?? 0,
    isFavorite: (id) => (state.favorites || []).some((favId) => String(favId) === String(id)),
    getItemsByCategory,
    getItemById,
    bestsellerItems,
  };
}
