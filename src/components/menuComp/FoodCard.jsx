"use client";

import React from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodCard({ item, currency = "₹" }) {
  const { getQuantity, increment, decrement, isFavorite, toggleFavorite } =
    useMenuOrder();

  const quantity = getQuantity(item.id);
  const favorite = isFavorite(item.id);

  return (
    <motion.div
      layout
      className="rounded-2xl bg-surface border border-border-light overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-soft">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {item.isBestseller && (
          <span className="absolute left-2 top-2 rounded-lg bg-surface/95 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-warning shadow-sm">
            ⭐ Bestseller
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(item.id)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center rounded-full bg-surface/95 backdrop-blur-sm shadow-sm active:scale-90 transition-transform"
        >
          <Heart
            size={15}
            className={favorite ? "text-danger" : "text-text-secondary"}
            fill={favorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-1">
          {item.title}
        </h3>

        <p className="mt-1 text-[11px] leading-snug text-text-muted line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-extrabold text-text-primary">
              {currency}
              {item.price}
            </span>
            {item.mrp && item.mrp > item.price && (
              <span className="text-[11px] text-text-muted line-through">
                {currency}
                {item.mrp}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {quantity === 0 ? (
              <motion.button
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => increment(item)}
                className="shrink-0 rounded-xl border border-primary/30 bg-success-light px-3.5 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-text-on-primary"
              >
                Add
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="shrink-0 flex items-center gap-1 rounded-xl border border-primary/30 bg-success-light px-1.5 py-1 text-primary"
              >
                <button
                  type="button"
                  onClick={() => decrement(item.id)}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 active:scale-90 transition-all"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="text-xs font-bold text-text-primary select-none w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => increment(item)}
                  aria-label="Increase quantity"
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 active:scale-90 transition-all"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}