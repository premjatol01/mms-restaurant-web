"use client";

import React, { useState } from "react";
import { 
  Bell, 
  X, 
  Droplets, 
  UtensilsCrossed, 
  Receipt, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  HandHelping
} from "lucide-react";
import { toast } from "sonner";
import { useMenuOrder } from "@/store/menuOrderStore";
import { formatTableName } from "@/utils/formatTableName";

const SERVICES = [
  { id: "General Help", label: "Call Waiter", icon: Bell, desc: "General help at your table" },
  { id: "Water Refill", label: "Water Refill", icon: Droplets, desc: "Need fresh drinking water" },
  { id: "Cutlery & Napkins", label: "Extra Cutlery", icon: UtensilsCrossed, desc: "Spoons, forks or napkins" },
  { id: "Bill Request", label: "Request Bill", icon: Receipt, desc: "Ready to pay the bill" },
  { id: "Clean Table", label: "Clean Table", icon: Sparkles, desc: "Clear empty plates/spills" },
];

export default function RequestWaiterModal({ isOpen, onClose }) {
  const { tableId, tableName, verifiedTable, verifiedRestaurant } = useMenuOrder();
  const [selectedService, setSelectedService] = useState("General Help");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const rawTable = verifiedTable?.tableName || verifiedTable?.tableNo || verifiedTable?.name || tableName;
  const displayTable = formatTableName(rawTable, "Table");
  const subdomain = verifiedRestaurant?.subdomain || (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "");

  const handleRequest = async () => {
    setSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const resolvedTableId =
      verifiedTable?.tableId ||
      verifiedTable?.id ||
      verifiedTable?._id ||
      tableId;

    try {
      const res = await fetch(`${apiUrl}/orders/public/request-waiter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          tableId: resolvedTableId,
          serviceType: selectedService,
          note: note.trim(),
        }),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success) {
        setSuccess(true);
        toast.success(`🛎️ Waiter requested for ${displayTable}! Staff has been notified.`);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1800);
      } else {
        toast.error(json?.message || "Failed to notify staff. Please call a waiter directly.");
      }
    } catch (err) {
      console.error("Error requesting waiter:", err);
      toast.error("Network error. Please call a waiter directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface rounded-t-[28px] sm:rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border-light">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <HandHelping size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Request Waiter Help
              </h2>
              <p className="text-xs text-text-muted">
                Assistance for {displayTable}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-soft transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-success-light text-primary flex items-center justify-center mx-auto animate-in zoom-in">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Staff Has Been Notified!
            </h3>
            <p className="text-xs text-text-muted max-w-xs mx-auto">
              A staff member is on their way to {displayTable} to assist you with {selectedService}.
            </p>
          </div>
        ) : (
          <>
            {/* Service Options */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary">
                What do you need help with?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedService === srv.id;

                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv.id)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border-light bg-surface hover:bg-surface-soft"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-primary text-white" : "bg-surface-soft text-text-muted"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary leading-tight">
                          {srv.label}
                        </p>
                        <p className="text-[10px] text-text-muted mt-0.5 truncate">
                          {srv.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note input */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Special instructions (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Extra napkins, warm water, quick bill..."
                maxLength={100}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-light bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl border border-border-light text-text-secondary text-xs font-bold hover:bg-surface-soft active:scale-[0.98] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequest}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Notifying Staff...
                  </>
                ) : (
                  <>
                    <Bell size={14} />
                    Call Waiter to Table
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

