"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import { Flame } from "lucide-react";
import React, { useMemo } from "react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function PopularItems() {
  const { searchQuery, bestsellerItems } = useMenuOrder();

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
        {visible.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}