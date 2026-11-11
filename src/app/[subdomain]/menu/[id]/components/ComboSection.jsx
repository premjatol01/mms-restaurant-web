"use client";

import React, { useState } from "react";
import { Layers2, ChevronDown } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import ComboCard from "./ComboCard";

export default function ComboSection() {
  const { combos } = useMenuOrder();
  const [showAll, setShowAll] = useState(false);

  if (!combos || combos.length === 0) return null;

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
        {(showAll ? combos : combos.slice(0, 8)).map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>

      {combos.length > 8 && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-soft hover:bg-border-light text-text-primary text-xs font-bold border border-border-light shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>{showAll ? "Show Less" : `Show More (${combos.length - 8} more)`}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </section>
  );
}
