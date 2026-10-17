"use client";

import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function MenuCategories({ onCategoryClick }) {
  const {
    categories,
    getItemsByCategory,
    selectedCategoryId,
    setSelectedCategoryId,
    setActiveTab,
  } = useMenuOrder();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter to show ONLY top-rated / featured categories (max 5)
  const displayCategories = useMemo(() => {
    const all = categories || [];
    const topOnly = all.filter((c) => Boolean(c.isTopCategory));
    if (topOnly.length > 0) {
      return topOnly.slice(0, 5);
    }
    // Fallback if none flagged as top: show first 5
    return all.slice(0, 5);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  const handleSelect = (catId) => {
    setSelectedCategoryId(catId);
    if (onCategoryClick) {
      onCategoryClick(catId);
    }
  };

  const handleViewAll = () => {
    setActiveTab("Categories");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "categories");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
            Top Categories
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Find your favorite meal
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary active:opacity-70 transition-opacity pb-0.5"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-2.5 -mx-4 overflow-x-auto scrollbar-none pb-1 px-4 snap-x snap-mandatory">
        {displayCategories.map((cat) => {
          const isActive = String(cat.id) === String(selectedCategoryId);
          const itemCount = getItemsByCategory(cat.id).length;

          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(cat.id)}
              className={`relative snap-start flex-shrink-0 w-[88px] py-3 px-2 rounded-2xl flex flex-col items-center gap-2 transition-colors duration-200 border ${
                isActive
                  ? "bg-primary border-primary shadow-lg shadow-primary/25"
                  : "bg-surface border-border-light"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden text-2xl ${
                  isActive ? "bg-white/20" : "bg-surface-soft"
                }`}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{cat.emoji || "🍽️"}</span>
                )}
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