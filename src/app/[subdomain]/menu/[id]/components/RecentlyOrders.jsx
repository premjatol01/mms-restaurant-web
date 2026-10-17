"use client";

import FoodCard from "@/components/menuComp/FoodCard";
import { History } from "lucide-react";
import React, { useMemo } from "react";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function RecentlyOrders() {
  const { orderHistory, activeOrder, getItemById, menuItems } = useMenuOrder();

  const visible = useMemo(() => {
    const orders = [...(activeOrder ? [activeOrder] : []), ...orderHistory];
    const seen = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((line) => {
        if (!line?.id || seen.has(line.id)) return;
        const catalogItem = getItemById ? getItemById(line.id) : null;
        if (catalogItem) {
          seen.set(line.id, catalogItem);
        } else if (line.title || line.name) {
          seen.set(line.id, {
            id: line.id,
            title: line.title || line.name,
            price: line.price,
            imageUrl: line.imageUrl || "",
          });
        }
      });
    });
    return Array.from(seen.values()).slice(0, 4);
  }, [orderHistory, activeOrder, menuItems]);

  if (visible.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-3">
        <h2 className="text-[17px] font-bold tracking-tight text-text-primary">
          Order Again
        </h2>
        <div className="w-5 h-5 rounded-full bg-surface-soft flex items-center justify-center">
          <History size={12} className="text-text-muted" />
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