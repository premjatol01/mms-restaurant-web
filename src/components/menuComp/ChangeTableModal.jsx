"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { toast } from "sonner";

export default function ChangeTableModal() {
  const router = useRouter();
  const {
    pendingTableShift,
    clearPendingTableShift,
    changeTable,
    verifiedRestaurant,
  } = useMenuOrder();

  const [loading, setLoading] = useState(false);

  if (!pendingTableShift) return null;

  const { fromTableId, fromTableName, toTableId, toTableName } = pendingTableShift;
  const subdomain = verifiedRestaurant?.subdomain;

  const handleConfirmShift = async () => {
    setLoading(true);
    try {
      const result = await changeTable({ subdomain, toTableId });
      setLoading(false);
      if (!result.ok) {
        toast.error(result.error || "Failed to shift table.");
        return;
      }
      toast.success(`Table switched to ${toTableName}! Your orders have been moved.`);
      // Update browser URL to target table
      if (subdomain && toTableId) {
        router.replace(`/${subdomain}/menu/${encodeURIComponent(toTableId)}`);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong while shifting table.");
    }
  };

  const handleStayOnPreviousTable = () => {
    clearPendingTableShift();
    if (subdomain && fromTableId) {
      router.replace(`/${subdomain}/menu/${encodeURIComponent(fromTableId)}`);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-surface border border-border-light rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 text-center relative overflow-hidden"
        >
          {/* Decorative Background Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <UtensilsCrossed size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-text-primary">
              Change Table?
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              You scanned a new table QR code. Would you like to transfer your active orders and dining session?
            </p>
          </div>

          {/* Table Transition Pill */}
          <div className="bg-surface-soft border border-border rounded-2xl p-3 flex items-center justify-center gap-3 text-xs font-bold text-text-primary">
            <div className="bg-surface px-3 py-1.5 rounded-xl border border-border-light shadow-sm text-text-secondary">
              {fromTableName || "Table 1"}
            </div>
            <ArrowRight size={16} className="text-primary shrink-0" />
            <div className="bg-primary text-text-on-primary px-3 py-1.5 rounded-xl shadow-sm">
              {toTableName || "Table 2"}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleConfirmShift}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-75 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? "Moving to new table..." : `Shift orders to ${toTableName}`}
            </button>
            <button
              type="button"
              onClick={handleStayOnPreviousTable}
              disabled={loading}
              className="w-full bg-surface-soft hover:bg-border/40 text-text-secondary font-semibold py-3 px-4 rounded-xl transition-colors text-xs"
            >
              Stay on {fromTableName || "previous table"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
