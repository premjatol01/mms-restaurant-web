"use client";

import React from "react";
import { Star, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";

const STEPS = [
  { key: "received", label: "Order received", note: "Placed with the kitchen" },
  { key: "preparing", label: "Preparing", note: "Kitchen is on it" },
  { key: "ready", label: "Ready", note: "We'll let you know" },
];

const statusLabel = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
};

export default function TableSession() {
  const { tableId, activeOrder, setActiveTab, completeActiveOrder } =
    useMenuOrder();

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader
        title={`Table ${tableId ?? "05"}`}
        subtitle={
          activeOrder
            ? "Everyone at this table shares one bill"
            : "No order placed yet"
        }
        showBack={false}
        trailing={
          activeOrder && (
            <span className="text-[10px] font-bold text-primary bg-success-light px-3 py-1 rounded-full uppercase tracking-wide">
              Active session
            </span>
          )
        }
      />

      {!activeOrder ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No active order"
          description="Add a few dishes from the menu and place an order to see live status here."
          actionLabel="Browse menu"
          onAction={() => setActiveTab("Menu")}
        />
      ) : (
        <>
          {/* Info Alert Box */}
          <div className="bg-success-light border border-primary-light/30 rounded-2xl p-4">
            <p className="text-primary/90 text-sm leading-relaxed">
              Everyone ordering from this table QR is combined into one table
              session and one consolidated bill.
            </p>
          </div>

          {/* Main Order Card */}
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-bold text-text-primary mb-1">
                  Current table order
                </h2>
                <p className="text-text-muted text-sm">
                  {activeOrder.items.length}{" "}
                  {activeOrder.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-success-light text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
                  {statusLabel[activeOrder.status]}
                </span>
                <span className="text-xl font-bold text-text-primary">
                  ₹{activeOrder.total}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {STEPS.map((step, index) => {
                const currentIndex = STEPS.findIndex(
                  (s) => s.key === activeOrder.status
                );
                const isDone = index <= currentIndex;

                return (
                  <div key={step.key} className="flex items-start">
                    <div className="mt-1 mr-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isDone ? "bg-primary" : "bg-border"
                        }`}
                      />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          isDone ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-text-muted text-xs">{step.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeOrder.status === "ready" && (
              <button
                type="button"
                onClick={completeActiveOrder}
                className="mt-6 w-full bg-primary hover:bg-primary-hover active:scale-[0.99] text-text-on-primary font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <CheckCircle2 size={18} />
                I&apos;ve received my order
              </button>
            )}
          </div>
        </>
      )}

      {/* Rate Experience Button */}
      <button
        onClick={() => setActiveTab("Rating")}
        className="w-full bg-surface rounded-2xl p-5 shadow-sm border border-border-light flex items-center justify-center relative hover:bg-surface-soft/60 transition-colors"
      >
        <div className="absolute left-5">
          <Star size={20} className="text-text-primary" />
        </div>
        <span className="font-bold text-text-primary text-base">
          Rate your experience
        </span>
      </button>
    </div>
  );
}
