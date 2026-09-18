"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

/**
 * Consistent header used at the top of every non-Home tab: an optional
 * back button (returns to Home), a title, an optional subtitle, and an
 * optional trailing element (badge, count, action).
 */
export default function PageHeader({ title, subtitle, showBack = true, trailing }) {
  const { setActiveTab } = useMenuOrder();

  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={() => setActiveTab("Home")}
            aria-label="Back to home"
            className="shrink-0 w-9 h-9 rounded-full bg-surface border border-border-light shadow-sm flex items-center justify-center text-text-secondary hover:bg-surface-soft transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-text-primary leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
