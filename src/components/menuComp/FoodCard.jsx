"use client";

import { useMenuOrder } from "@/context/Menuordercontext";
import React from "react";

export default function FoodCard({ item, currency = "₹" }) {
  const { getQuantity, increment, decrement, isFavorite, toggleFavorite } =
    useMenuOrder();

  const quantity = getQuantity(item.id);
  const favorite = isFavorite(item.id);

  return (
    <div className="max-w-xs rounded-lg bg-white shadow-md border border-gray-100 font-sans">
      {/* Image Container */}
      <div className="relative h-fit w-full overflow-hidden rounded-t-lg">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-35 w-full object-cover"
        />

        {/* Bestseller Badge */}
        {item.isBestseller && (
          <span className="absolute left-3 top-3 rounded-lg bg-white px-3 py-1 text-xs font-bold text-amber-800 shadow-sm">
            Bestseller
          </span>
        )}

        {/* Wishlist / Heart Button */}
        <button
          onClick={() => toggleFavorite(item.id)}
          aria-label="Add to favorites"
          aria-pressed={favorite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm transition hover:text-red-500 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={favorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className={`h-5 w-5 ${favorite ? "text-red-500" : "text-gray-700"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Content Container */}
      <div className="p-3">
        <h3 className="text-base font-bold text-slate-800">{item.title}</h3>

        <p className="mt-1 text-sm leading-snug text-slate-500">
          {item.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-extrabold text-slate-900">
            {currency}
            {item.price}
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => increment(item)}
              className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-1.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-95"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center space-x-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 text-emerald-900">
              <button
                onClick={() => decrement(item.id)}
                className="text-lg font-medium text-emerald-800 transition hover:scale-110 active:scale-95 select-none"
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span className="text-sm font-bold text-emerald-950 select-none">
                {quantity}
              </span>
              <button
                onClick={() => increment(item)}
                className="text-lg font-medium text-emerald-800 transition hover:scale-110 active:scale-95 select-none"
                aria-label="Increase quantity"
              >
                &#43;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}