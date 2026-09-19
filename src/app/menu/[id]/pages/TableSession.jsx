"use client";

import React from "react";
import {
  Star,
  UtensilsCrossed,
  CheckCircle2,
  Users,
  ChefHat,
  Bell,
  CircleDot,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";
import { motion } from "framer-motion";

const STEPS = [
  {
    key: "received",
    label: "Order received",
    note: "Placed with the kitchen",
    icon: CircleDot,
  },
  {
    key: "preparing",
    label: "Preparing",
    note: "Kitchen is on it",
    icon: ChefHat,
  },
  {
    key: "ready",
    label: "Ready",
    note: "We'll let you know",
    icon: Bell,
  },
];

const statusLabel = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
};

export default function TableSession() {
  const { tableId, activeOrder, setActiveTab, completeActiveOrder } =
    useMenuOrder();

  const currentIndex = activeOrder
    ? STEPS.findIndex((s) => s.key === activeOrder.status)
    : -1;

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
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-success-light px-2.5 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Active
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
          {/* Info Box */}
          <div className="bg-success-light border border-primary-light/30 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center shrink-0 mt-0.5">
              <Users size={14} className="text-primary" />
            </div>
            <p className="text-primary/90 text-xs leading-relaxed">
              Everyone ordering from this table QR is combined into one table
              session and one consolidated bill.
            </p>
          </div>

          {/* Order Card */}
          <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-bold text-text-primary mb-0.5">
                  Current order
                </h2>
                <p className="text-[11px] text-text-muted">
                  {activeOrder.items.length}{" "}
                  {activeOrder.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-success-light text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {statusLabel[activeOrder.status]}
                </span>
                <span className="text-xl font-extrabold text-text-primary">
                  ₹{activeOrder.total}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {STEPS.map((step, index) => {
                const isDone = index <= currentIndex;
                const isActive = index === currentIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    {/* Connector line */}
                    {index < STEPS.length - 1 && (
                      <div
                        className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                          index < currentIndex ? "bg-primary" : "bg-border"
                        }`}
                        style={{ height: "calc(100% - 8px)" }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? "bg-primary text-text-on-primary"
                          : "bg-surface-soft text-text-muted"
                      }`}
                    >
                      {isDone && !isActive ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Icon size={17} />
                      )}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex justify-between items-start pt-1.5 pb-6">
                      <span
                        className={`text-sm font-semibold ${
                          isDone ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-[11px] text-text-muted text-right max-w-[45%]">
                        {step.note}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeOrder.status === "ready" && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={completeActiveOrder}
                className="mt-2 w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
              >
                <CheckCircle2 size={18} />
                I've received my order
              </motion.button>
            )}
          </div>
        </>
      )}

      {/* Rate Experience */}
      <button
        onClick={() => setActiveTab("Rating")}
        className="w-full bg-surface rounded-2xl p-4 border border-border-light shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
          <Star size={18} className="text-warning" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-text-primary">
            Rate your experience
          </h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Your feedback helps us improve
          </p>
        </div>
        <span className="text-primary text-xs font-bold">Rate →</span>
      </button>
    </div>
  );
}