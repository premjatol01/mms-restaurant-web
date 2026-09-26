"use client";

import React from "react";
import { Layers2 } from "lucide-react";
import { comboOrders } from "@/data/menuItems";
import ComboCard from "./ComboCard";

export default function ComboSection() {
  if (!comboOrders || comboOrders.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Layers2 size={15} className="text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-text-primary leading-tight">
            Combo Deals
          </h2>
          <p className="text-[10px] text-text-muted">
            Curated sets · Better together
          </p>
        </div>
      </div>

      {/* Cards — each is full width */}
      <div className="space-y-3">
        {comboOrders.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>
    </section>
  );
}
