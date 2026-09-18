"use client";

import React from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function FoodCard({ item, currency = "₹" }) {
  const { getQuantity, increment, decrement, isFavorite, toggleFavorite } =
    useMenuOrder();

  const quantity = getQuantity(item.id);
  const favorite = isFavorite(item.id);

  return (
    <div className="rounded-xl bg-surface shadow-sm border border-border-light overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {item.isBestseller && (
          <span className="absolute left-2 top-2 rounded-md bg-surface/95 px-2 py-1 text-[10px] font-bold text-warning shadow-sm">
            Bestseller
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(item.id)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/95 text-text-secondary shadow-sm transition hover:text-danger active:scale-95"
        >
          <Heart
            size={16}
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

        <p className="mt-1 text-xs leading-snug text-text-muted line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
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

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => increment(item)}
              className="shrink-0 rounded-lg border border-primary/30 bg-success-light px-3.5 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-text-on-primary active:scale-95"
            >
              Add
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-2.5 rounded-lg border border-primary/30 bg-success-light px-2 py-1.5 text-primary">
              <button
                type="button"
                onClick={() => decrement(item.id)}
                aria-label="Decrease quantity"
                className="transition hover:scale-110 active:scale-95"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
              <span className="text-xs font-bold text-text-primary select-none w-3 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => increment(item)}
                aria-label="Increase quantity"
                className="transition hover:scale-110 active:scale-95"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
