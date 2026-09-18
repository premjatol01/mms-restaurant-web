"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import { History } from "lucide-react";
import React, { useMemo } from "react";
import { getItemById } from "@/data/menuItems";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function RecentlyOrders() {
  const { orderHistory, activeOrder } = useMenuOrder();

  // Pull the catalog item behind every past/active order line so we can
  // reuse FoodCard (and its live cart controls) instead of a static list.
  const visible = useMemo(() => {
    const orders = [...(activeOrder ? [activeOrder] : []), ...orderHistory];
    const seen = new Map();
    orders.forEach((order) => {
      order.items.forEach((line) => {
        if (seen.has(line.id)) return;
        const catalogItem = getItemById(line.id);
        if (catalogItem) seen.set(line.id, catalogItem);
      });
    });
    return Array.from(seen.values()).slice(0, 4);
  }, [orderHistory, activeOrder]);

  if (visible.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 py-2">
        <h2 className="text-base font-bold tracking-tight text-text-primary">
          Order Again
        </h2>
        <History size={15} className="text-text-muted" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {visible.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
