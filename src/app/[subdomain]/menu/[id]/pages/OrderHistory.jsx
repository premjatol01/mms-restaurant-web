"use client";

import React from "react";
import { toast } from "sonner";
import { Receipt, Plus, ClipboardList, Clock } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function summarizeItems(items) {
  if (items.length === 0) return "";
  const [first, ...rest] = items;
  const label = `${first.title}${
    first.quantity > 1 ? ` × ${first.quantity}` : ""
  }`;
  return rest.length > 0 ? `${label} + ${rest.length} more` : label;
}

function OrderCard({ order, onReorder }) {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center min-w-0">
          <div className="w-11 h-11 rounded-xl bg-success-light flex items-center justify-center shrink-0">
            <Receipt size={18} className="text-primary" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary mb-0.5 truncate">
              Order #{order.id.replace("ORD-", "")}
            </h3>
            <p className="text-[11px] text-text-muted flex items-center gap-1">
              <Clock size={10} />
              {formatDate(order.completedAt ?? order.placedAt)}
            </p>
          </div>
        </div>
        <span className="text-base font-extrabold text-text-primary shrink-0">
          ₹{order.total}
        </span>
      </div>

      <div className="pb-3 border-b border-border-light">
        <p className="text-xs text-text-muted line-clamp-1">
          {summarizeItems(order.items)}
        </p>
      </div>

      <div className="flex justify-between items-center pt-3">
        <div className="flex items-center gap-1.5 bg-success-light px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Completed
          </span>
        </div>

        <button
          type="button"
          onClick={() => onReorder(order)}
          className="bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm shadow-primary/20"
        >
          Reorder
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

const OrderHistory = () => {
  const { orderHistory, reorder, setActiveTab } = useMenuOrder();

  const handleReorder = (order) => {
    reorder(order);
    toast.success("Added to your cart");
  };

  return (
    <div className="px-4 pt-4 pb-28">
      <PageHeader
        title="Order History"
        subtitle={`${orderHistory.length} previous order${
          orderHistory.length === 1 ? "" : "s"
        }`}
      />

      {orderHistory.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Completed orders from this table session will show up here."
          actionLabel="Browse menu"
          onAction={() => setActiveTab("Menu")}
        />
      ) : (
        <div className="space-y-3">
          {orderHistory.map((order) => (
            <OrderCard key={order.id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;