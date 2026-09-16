"use client";

import React from "react";
import { ChevronRight, X, ShoppingCart } from "lucide-react";
import { useMenuOrder } from "@/context/Menuordercontext";

export default function FloatingCartBar() {
  const {
    totalItems,
    subtotal,
    mrpTotal,
    hasDiscount,
    isCartExpanded,
    setCartExpanded,
  } = useMenuOrder();

  // Nothing in the cart, nothing to float.
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 max-w-md mx-auto z-40">
      {isCartExpanded ? (
        /* Expanded Cart Bar */
        <div className="relative w-[98%] bg-text-primary text-text-on-primary rounded-lg p-2.5 flex items-center justify-between gap-3 shadow-xl border border-white/10 backdrop-blur-md mx-auto">
          <button
            type="button"
            aria-label="Minimize cart"
            onClick={() => setCartExpanded(false)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface text-text-primary border border-border shadow-md flex items-center justify-center hover:bg-surface-soft active:scale-95 transition-all z-10"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs font-medium text-text-muted/80 tracking-wide uppercase truncate">
              {totalItems} {totalItems === 1 ? "item" : "items"} added
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold tracking-tight">
                ₹{subtotal}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-text-muted line-through">
                  ₹{mrpTotal}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="View shopping cart"
            className="bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <span>View Cart</span>
            <ChevronRight size={18} className="translate-y-[0.5px]" />
          </button>
        </div>
      ) : (
        /* Collapsed Round Cart Button */
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Expand cart"
            onClick={() => setCartExpanded(true)}
            className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary-hover active:scale-95 text-text-on-primary shadow-xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-text-primary text-text-on-primary text-[10px] font-bold flex items-center justify-center border-2 border-background">
              {totalItems}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}