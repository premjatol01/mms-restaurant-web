"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { categories } from "@/data/menuItems";
import { useMenuOrder } from "@/context/Menuordercontext";

export default function MenuCategories() {
  const { selectedCategoryId, setSelectedCategoryId, setActiveTab } =
    useMenuOrder();

  return (
    <section className="mb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Explore Categories
          </h2>
          <p className="text-xs text-text-muted">Find your favorite meal</p>
        </div>
        <button
          onClick={() => setActiveTab("Menu")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors px-2.5 py-1.5 rounded-lg hover:bg-surface-soft"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="flex gap-3 -mx-3 overflow-x-auto scrollbar-none pb-2 px-4 snap-x snap-mandatory">
        {categories.map((cat) => {
          const isActive = cat.id === selectedCategoryId;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`overflow-hidden snap-start flex-shrink-0 w-28 p-2 rounded-lg flex flex-col items-center justify-between gap-2.5 transition-all duration-200 border text-left cursor-pointer group ${
                isActive
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-surface border-border-light hover:border-primary/40 hover:bg-surface-soft/60 shadow-sm"
              }`}
            >
              <div
                className={`w-full h-12 rounded-md flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                  isActive ? "bg-white/20" : "bg-surface-soft"
                }`}
              >
                {cat.emoji}
              </div>

              <div className="text-center w-full">
                <span
                  className={`block text-xs font-bold leading-tight truncate ${
                    isActive ? "text-white" : "text-text-primary"
                  }`}
                >
                  {cat.name}
                </span>
                <span
                  className={`block text-[10px] font-medium mt-0.5 ${
                    isActive ? "text-white/80" : "text-text-muted"
                  }`}
                >
                  {cat.itemsCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
