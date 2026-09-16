"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const STORAGE_KEY = "menu-order-v1";

const MenuOrderContext = createContext(null);

const initialState = {
  // cart items keyed by id -> { id, title, price, imageUrl, quantity }
  items: {},
  favorites: [],
  activeTab: "Menu",
  selectedCategoryId: 1,
  searchQuery: "",
  isCartExpanded: true,
  hydrated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };

    case "ADD_ITEM": {
      const { item, quantity = 1 } = action;
      const existing = state.items[item.id];
      return {
        ...state,
        items: {
          ...state.items,
          [item.id]: {
            ...item,
            quantity: (existing?.quantity ?? 0) + quantity,
          },
        },
      };
    }

    case "SET_QUANTITY": {
      const { id, quantity } = action;
      const existing = state.items[id];
      if (!existing) return state;

      if (quantity <= 0) {
        const { [id]: _removed, ...rest } = state.items;
        return { ...state, items: rest };
      }
      return {
        ...state,
        items: { ...state.items, [id]: { ...existing, quantity } },
      };
    }

    case "REMOVE_ITEM": {
      const { [action.id]: _removed, ...rest } = state.items;
      return { ...state, items: rest };
    }

    case "CLEAR_CART":
      return { ...state, items: {} };

    case "TOGGLE_FAVORITE": {
      const exists = state.favorites.includes(action.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      };
    }

    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.tab };

    case "SET_CATEGORY":
      return { ...state, selectedCategoryId: action.id };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };

    case "SET_CART_EXPANDED":
      return { ...state, isCartExpanded: action.value };

    default:
      return state;
  }
}

export function MenuOrderProvider({ children, tableId = null }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Read persisted cart after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        dispatch({
          type: "HYDRATE",
          payload: {
            items: saved.items ?? {},
            favorites: saved.favorites ?? [],
          },
        });
        return;
      }
    } catch {
      // corrupt or unavailable storage — start clean
    }
    dispatch({ type: "HYDRATE", payload: {} });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, favorites: state.favorites })
      );
    } catch {
      // storage full / private mode — non-fatal
    }
  }, [state.items, state.favorites, state.hydrated]);

  const value = useMemo(() => {
    const cartItems = Object.values(state.items);
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const mrpTotal = cartItems.reduce(
      (sum, i) => sum + (i.mrp ?? i.price) * i.quantity,
      0
    );

    return {
      ...state,
      tableId,
      cartItems,
      totalItems,
      subtotal,
      mrpTotal,
      hasDiscount: mrpTotal > subtotal,

      getQuantity: (id) => state.items[id]?.quantity ?? 0,
      isFavorite: (id) => state.favorites.includes(id),

      addItem: (item, quantity = 1) =>
        dispatch({ type: "ADD_ITEM", item, quantity }),
      setQuantity: (id, quantity) =>
        dispatch({ type: "SET_QUANTITY", id, quantity }),
      increment: (item) => dispatch({ type: "ADD_ITEM", item, quantity: 1 }),
      decrement: (id) =>
        dispatch({
          type: "SET_QUANTITY",
          id,
          quantity: (state.items[id]?.quantity ?? 0) - 1,
        }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", id }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      toggleFavorite: (id) => dispatch({ type: "TOGGLE_FAVORITE", id }),

      setActiveTab: (tab) => dispatch({ type: "SET_ACTIVE_TAB", tab }),
      setSelectedCategoryId: (id) => dispatch({ type: "SET_CATEGORY", id }),
      setSearchQuery: (query) => dispatch({ type: "SET_SEARCH", query }),
      setCartExpanded: (value) =>
        dispatch({ type: "SET_CART_EXPANDED", value }),
    };
  }, [state, tableId]);

  return (
    <MenuOrderContext.Provider value={value}>
      {children}
    </MenuOrderContext.Provider>
  );
}

export function useMenuOrder() {
  const ctx = useContext(MenuOrderContext);
  if (!ctx) {
    throw new Error("useMenuOrder must be used inside <MenuOrderProvider>");
  }
  return ctx;
}