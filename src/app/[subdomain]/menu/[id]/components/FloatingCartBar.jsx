"use client";

import React from "react";
import { ChevronRight, X, ShoppingBag } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCartBar() {
  const {
    totalItems,
    subtotal,
    mrpTotal,
    hasDiscount,
    isCartExpanded,
    setCartExpanded,
    setActiveTab,
  } = useMenuOrder();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-[76px] inset-x-0 max-w-md mx-auto z-40 px-4">
      <AnimatePresence mode="wait">
        {isCartExpanded ? (
          /* Expanded Cart Bar */
          <motion.div
            key="expanded"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative bg-text-primary text-text-on-primary rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xl shadow-black/20"
          >
            <button
              type="button"
              aria-label="Minimize cart"
              onClick={() => setCartExpanded(false)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface text-text-primary border border-border flex items-center justify-center active:scale-90 transition-transform z-10"
            >
              <X size={13} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={18} />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold text-white/60 tracking-wider uppercase">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-extrabold tracking-tight">
                    ₹{subtotal}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-white/50 line-through">
                      ₹{mrpTotal}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="View cart"
              onClick={() => setActiveTab("Cart")}
              className="bg-primary hover:bg-primary-hover active:scale-[0.97] text-text-on-primary text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-1 transition-all shrink-0"
            >
              View Cart
              <ChevronRight size={16} />
            </button>
          </motion.div>
        ) : (
          /* Collapsed Round Button */
          <motion.div
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex justify-end"
          >
            <button
              type="button"
              aria-label="Expand cart"
              onClick={() => setCartExpanded(true)}
              className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary-hover active:scale-95 text-text-on-primary shadow-2xl shadow-primary/40 flex items-center justify-center transition-all"
            >
              <ShoppingBag size={22} />
              <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-text-primary text-text-on-primary text-[11px] font-bold flex items-center justify-center border-2 border-background">
                {totalItems}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}