"use client";

import React from "react";
import { Heart, ShoppingBag, MapPin } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { totalItems, favorites, tableId, setActiveTab } = useMenuOrder();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 max-w-md mx-auto bg-surface/95 backdrop-blur-xl border-b border-border-light">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center text-text-on-primary font-bold text-lg shadow-lg shadow-primary/20">
            SG
          </div>
          <div>
            <h1 className="text-text-primary font-bold text-[15px] leading-tight">
              Spice Garden
            </h1>
            <p className="text-text-muted text-[11px] font-medium">
              Good food · Better mood
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Table Badge */}
          {/* <div className="flex items-center gap-1 bg-success-light text-primary text-[11px] font-bold px-2.5 py-1.5 rounded-full">
            <MapPin size={12} />
            <span>Table {tableId ?? "05"}</span>
          </div> */}

          {/* Favorites */}
          <button
            onClick={() => setActiveTab("Favorites")}
            className="relative w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
            aria-label="Favorites"
          >
            <Heart size={18} />
            <AnimatePresence>
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface"
                >
                  {favorites.length}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Cart */}
          <button
            onClick={() => setActiveTab("Cart")}
            className="relative w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-text-secondary active:scale-95 transition-transform"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-cart-badge text-text-on-primary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-surface"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}