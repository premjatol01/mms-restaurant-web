"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import { Flame } from "lucide-react";
import React, { useMemo } from "react";
import { bestsellerItems } from "@/data/menuItems";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function PopularItems() {
  const { searchQuery } = useMenuOrder();

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return bestsellerItems;
    return bestsellerItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (visible.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 py-2">
        <h2 className="text-base font-bold tracking-tight text-text-primary">
          Popular Items
        </h2>
        <Flame size={16} className="text-warning" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {visible.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
