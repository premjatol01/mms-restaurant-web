"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { categories, getItemsByCategory } from "@/data/menuItems";
import { useMenuOrder } from "@/store/menuOrderStore";
import { motion } from "framer-motion";

export default function MenuCategories() {
  const { selectedCategoryId, setSelectedCategoryId, setActiveTab } =
    useMenuOrder();

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
            Categories
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Find your favorite meal
          </p>
        </div>
        <button
          onClick={() => setActiveTab("Categories")}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary active:opacity-70 transition-opacity pb-0.5"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-2.5 -mx-4 overflow-x-auto scrollbar-none pb-1 px-4 snap-x snap-mandatory">
        {categories.map((cat) => {
          const isActive = cat.id === selectedCategoryId;
          const itemCount = getItemsByCategory(cat.id).length;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`relative snap-start flex-shrink-0 w-[88px] py-3 px-2 rounded-2xl flex flex-col items-center gap-2 transition-colors duration-200 border ${
                isActive
                  ? "bg-primary border-primary shadow-lg shadow-primary/25"
                  : "bg-surface border-border-light"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  isActive ? "bg-white/20" : "bg-surface-soft"
                }`}
              >
                {cat.emoji}
              </div>

              <div className="text-center w-full">
                <span
                  className={`block text-[11px] font-bold leading-tight truncate ${
                    isActive ? "text-white" : "text-text-primary"
                  }`}
                >
                  {cat.name}
                </span>
                <span
                  className={`block text-[10px] font-medium mt-0.5 ${
                    isActive ? "text-white/75" : "text-text-muted"
                  }`}
                >
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}