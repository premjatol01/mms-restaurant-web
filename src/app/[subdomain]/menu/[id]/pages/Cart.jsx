"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronRight,
  History,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  BadgePercent,
  Tag,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import { formatTableName } from "@/utils/formatTableName";

function OrderItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-surface rounded-2xl p-3 border border-border-light shadow-sm flex items-start gap-3"
    >
      <div className="w-16 h-16 rounded-xl bg-surface-soft flex items-center justify-center flex-shrink-0 overflow-hidden border border-border-light">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-bold text-text-primary line-clamp-1">
            {item.title}
          </h3>
          <span className="text-sm font-bold text-text-primary shrink-0">
            ₹{item.price * item.quantity}
          </span>
        </div>
        <p className="text-[11px] text-text-muted mt-0.5">
          ₹{item.price} each
        </p>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center border border-border rounded-full overflow-hidden bg-surface">
            <button
              type="button"
              onClick={() => onDecrement(item.id)}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-soft active:scale-90 transition-all"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="w-7 text-center text-sm font-bold text-text-primary">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrement(item)}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-surface-soft active:scale-90 transition-all"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 active:scale-90 transition-all"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const Cart = () => {
  const params = useParams();
  const subdomain = params?.subdomain;

  const {
    tableId,
    tableName,
    verifiedTable,
    cartItems,
    subtotal,
    offerDiscount,
    finalTotal,
    appliedOffer,
    isOfferApplied,
    applyOffer,
    removeOffer,
    setAppliedOffer,
    setActiveTab,
    increment,
    decrement,
    removeItem,
    placeOrder,
    mobile,
    activeOrder,
    isSubmittingOrder,
  } = useMenuOrder();

  const rawTable = verifiedTable?.tableName || verifiedTable?.tableNo || verifiedTable?.name || (tableName && tableName.length !== 24 ? tableName : null);
  const displayTableName = formatTableName(rawTable, "Table");

  // If no offer is selected, check eligibility and auto-suggest the best qualified offer
  useEffect(() => {
    if (!subdomain || cartItems.length === 0 || appliedOffer) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const tableSpend = (activeOrder?.total ?? 0) + subtotal;

    fetch(`${apiUrl}/public/offers/check-eligibility`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: subdomain,
        mobile: mobile?.verified ? mobile.number : null,
        currentOrderTotal: tableSpend,
        items: cartItems
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          const eligibleOffers = json.data.filter((o) => o.isEligible);
          if (eligibleOffers.length > 0) {
            // Sort by highest potential discount
            eligibleOffers.sort((a, b) => (b.potentialDiscount || 0) - (a.potentialDiscount || 0));
            setAppliedOffer(eligibleOffers[0]);
          }
        }
      })
      .catch(() => {});
  }, [subdomain, cartItems.length, appliedOffer, subtotal, activeOrder?.total, mobile?.verified, mobile?.number, setAppliedOffer]);

  const handlePlaceOrder = async () => {
    const result = await placeOrder({
      subdomain,
      tableId: params?.id || tableId,
      mobile: mobile?.verified ? mobile.number : (mobile?.number || null),
    });
    if (!result.ok) {
      toast.error(result.error ?? "Couldn't place the order");
      return;
    }
    toast.success("Order placed! Track it on the Table tab.");
    setActiveTab("Table");
  };

  const getDiscountBadgeText = () => {
    if (!appliedOffer) return "";
    if (appliedOffer.benefit?.type === "flat") {
      return `₹${appliedOffer.benefit.value} OFF`;
    }
    return `${appliedOffer.benefit?.value || 0}% OFF`;
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader
        title="Your Order"
        subtitle={
          cartItems.length > 0
            ? `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in cart`
            : "Cart is empty"
        }
        trailing={
          <div className="flex items-center gap-1 bg-success-light text-primary text-[11px] font-bold px-2.5 py-1.5 rounded-full">
            <span>{displayTableName}</span>
          </div>
        }
      />

      {/* History Banner */}
      <button
        type="button"
        onClick={() => setActiveTab("History")}
        className="w-full bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-3.5 flex items-center justify-between active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <History size={18} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-white font-bold text-sm">Order History</h3>
            <p className="text-white/70 text-[11px] mt-0.5">
              View your previous orders
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-white/80" />
      </button>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the menu and add a few dishes to get started."
          actionLabel="Browse menu"
          onAction={() => setActiveTab("Menu")}
        />
      ) : (
        <>
          {/* Order Items */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <OrderItem
                  key={item.id}
                  item={item}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Offers & Promos Card */}
          <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
            {appliedOffer && isOfferApplied ? (
              <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl p-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                    <Tag size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-primary truncate">
                      {appliedOffer.name} ({getDiscountBadgeText()})
                    </p>
                    <p className="text-[11px] text-primary/80 font-medium">
                      Saving ₹{offerDiscount} on this bill
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={removeOffer}
                    className="text-xs font-bold text-danger hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : appliedOffer && !isOfferApplied ? (
              <div className="flex items-center justify-between bg-surface-soft border border-border rounded-xl p-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Tag size={16} className="text-text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {appliedOffer.name} ({getDiscountBadgeText()})
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Offer available for your order
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={applyOffer}
                  className="text-xs font-bold text-primary hover:underline px-2 py-1"
                >
                  Apply
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("Offers")}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      Offers & Promotions
                    </p>
                    <p className="text-[11px] text-text-muted">
                      View discounts applicable to your meal
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              </button>
            )}

            {appliedOffer && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setActiveTab("Offers")}
                  className="text-[11px] text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  View other offers <ChevronRight size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BadgePercent size={16} className="text-text-muted" />
              <h3 className="text-sm font-bold text-text-primary">
                Bill Summary
              </h3>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-semibold text-text-primary">
                  ₹{subtotal}
                </span>
              </div>

              {offerDiscount > 0 && isOfferApplied && (
                <div className="flex justify-between text-sm text-primary font-medium">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} />
                    Offer Discount ({getDiscountBadgeText()})
                  </span>
                  <span className="font-bold">
                    -₹{offerDiscount}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-border-light pt-4 mb-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base font-bold text-text-primary block">
                    Total
                  </span>
                  {offerDiscount > 0 && isOfferApplied && (
                    <span className="text-[11px] text-primary font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      You save ₹{offerDiscount} on this order
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {offerDiscount > 0 && isOfferApplied && (
                    <span className="text-xs text-text-muted line-through mr-2">
                      ₹{subtotal}
                    </span>
                  )}
                  <span className="text-xl font-extrabold text-text-primary">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmittingOrder}
              className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-text-on-primary font-bold rounded-xl py-4 flex items-center justify-between px-6 transition-all shadow-lg shadow-primary/20"
            >
              <span>{isSubmittingOrder ? "Placing order..." : "Place order"}</span>
              <span className="font-extrabold">₹{finalTotal}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;