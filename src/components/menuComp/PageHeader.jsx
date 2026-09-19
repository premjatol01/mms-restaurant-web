"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

/**
 * Consistent header used at the top of every non-Home tab: an optional
 * back button (returns to Home), a title, an optional subtitle, and an
 * optional trailing element (badge, count, action).
 */
export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  trailing,
}) {
  const { setActiveTab } = useMenuOrder();

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <button
            type="button"
            onClick={() => setActiveTab("Home")}
            aria-label="Back to home"
            className="shrink-0 w-10 h-10 rounded-2xl bg-surface border border-border-light shadow-sm flex items-center justify-center text-text-secondary active:scale-90 hover:bg-surface-soft transition-all"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold text-text-primary leading-tight tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-text-muted mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}