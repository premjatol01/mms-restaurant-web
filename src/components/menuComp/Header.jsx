"use client";

import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function Header() {
  const { totalItems, favorites, tableId, setActiveTab } = useMenuOrder();

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border-light px-4 py-3 flex items-center justify-between">
      {/* Brand Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-text-on-primary font-bold text-lg">
          SG
        </div>
        <div className="flex flex-col">
          <h1 className="text-text-primary font-bold text-base leading-tight">
            Spice Garden
          </h1>
          <p className="text-text-muted text-xs">Good food · Better mood</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab("Favorites")}
          className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors"
        >
          <Heart size={20} />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-cart-badge text-text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        <div className="bg-success-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
          Table {tableId ?? "05"}
        </div>

        <button onClick={()=> setActiveTab("Cart")} className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors">
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-cart-badge text-text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
