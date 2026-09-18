"use client";

import React from "react";
import { toast } from "sonner";
import { Receipt, Plus, ClipboardList } from "lucide-react";
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
  const label = `${first.title}${first.quantity > 1 ? ` x${first.quantity}` : ""}`;
  return rest.length > 0 ? `${label} + ${rest.length} more` : label;
}

function OrderCard({ order, onReorder }) {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light mb-4 last:mb-0">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center min-w-0">
          <div className="bg-success-light p-3 rounded-2xl flex items-center justify-center shrink-0">
            <Receipt size={20} className="text-primary" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary mb-0.5 truncate">
              Order #{order.id.replace("ORD-", "")}
            </h3>
            <p className="text-xs text-text-muted font-medium">
              {formatDate(order.completedAt ?? order.placedAt)}
            </p>
          </div>
        </div>
        <div className="text-base font-bold text-text-primary shrink-0">
          ₹{order.total}
        </div>
      </div>

      <div className="pb-4 border-b border-border-light">
        <p className="text-sm text-text-muted line-clamp-1">
          {summarizeItems(order.items)}
        </p>
      </div>

      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-bold text-primary">Completed</span>
        </div>

        <button
          type="button"
          onClick={() => onReorder(order)}
          className="bg-success-light hover:bg-success-light/70 text-primary text-sm font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          Reorder
          <Plus size={16} strokeWidth={2.5} />
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
        subtitle="Your previous orders at this table"
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
        <div>
          {orderHistory.map((order) => (
            <OrderCard key={order.id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
