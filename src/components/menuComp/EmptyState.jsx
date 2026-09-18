"use client";

import React from "react";

/**
 * Consistent empty-state block used across every tab so a "nothing here
 * yet" moment still feels designed, not broken.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  tone = "primary", // "primary" | "danger"
}) {
  const iconWrapClasses =
    tone === "danger"
      ? "bg-danger-light text-danger"
      : "bg-success-light text-primary";

  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-12">
      {Icon && (
        <div
          className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${iconWrapClasses}`}
        >
          <Icon size={28} strokeWidth={1.75} />
        </div>
      )}

      <h2 className="text-lg font-bold text-text-primary mb-2">{title}</h2>

      {description && (
        <p className="text-sm text-text-muted leading-relaxed max-w-[260px] mb-6">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary font-semibold text-sm py-3 px-6 transition-all shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
