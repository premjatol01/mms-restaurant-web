"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import { ArrowRight } from "lucide-react";
import React, { useMemo } from "react";
import { popularItems } from "@/data/menuItems";
import { useMenuOrder } from "@/context/Menuordercontext";

export default function AllItems() {
  const { searchQuery, selectedCategoryId } = useMenuOrder();

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return popularItems.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      // When searching, ignore the category filter.
      const matchesCategory = q ? true : item.categoryId === selectedCategoryId;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, selectedCategoryId]);

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Popular Items
          </h2>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mt-0.5" />
        </div>
        <button className="group flex items-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700">
          <span className="font-semibold text-xs">See all</span>
          <span className="transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          Nothing matches that yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {visible.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
