"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import { Flame, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function PopularItems() {
  const { searchQuery, bestsellerItems } = useMenuOrder();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [searchQuery]);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const items = bestsellerItems || [];
    if (!q) return items;
    return items.filter((item) => {
      const title = (item.title || item.name || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [searchQuery, bestsellerItems]);

  if (visible.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-3">
        <h2 className="text-[17px] font-bold tracking-tight text-text-primary">
          Popular Items
        </h2>
        <div className="w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center">
          <Flame size={12} className="text-warning" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(showAll ? visible : visible.slice(0, 8)).map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>

      {visible.length > 8 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-soft hover:bg-border-light text-text-primary text-xs font-bold border border-border-light shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>{showAll ? "Show Less" : `Show More (${visible.length - 8} more)`}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </section>
  );
}