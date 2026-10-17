"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Star,
  UtensilsCrossed,
  CheckCircle2,
  Users,
  ChefHat,
  Bell,
  CircleDot,
  Tag,
  Trash2,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  BadgePercent,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";
import { motion } from "framer-motion";
import { formatTableName } from "@/utils/formatTableName";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const APPLIED_PROMO = "WELCOME10";
const PROMO_RATE = 0.1;


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
    label: "Ready & Served",
    note: "Delivered to table",
    icon: Bell,
  },
];

const statusLabel = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  served: "Delivered",
  pending: "Received",
  processing: "Preparing",
};

export default function TableSession() {
  const { 
    tableId, 
    tableName,
    verifiedTable,
    activeOrder, 
    sessionOrders,
    currentSession,
    setActiveTab, 
    completeActiveOrder,
    mobile,
    isOfferApplied,
    appliedOffer,
    removeOffer,
    applyOffer,
    openOffersModal,
  } = useMenuOrder();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTable = verifiedTable?.tableName || verifiedTable?.tableNo || verifiedTable?.name || (tableName && tableName.length !== 24 ? tableName : null);
  const displayTableName = formatTableName(rawTable, "Table");

  const currentIndex = activeOrder
    ? activeOrder.status === "delivered"
      ? 2
      : STEPS.findIndex((s) => s.key === activeOrder.status)
    : -1;

  // Real consolidated items total for this active table session
  const itemTotal = currentSession?.subtotal ?? activeOrder?.subtotal ?? activeOrder?.total ?? 0;
  
  const gstAmount = currentSession?.gst ?? Math.round(itemTotal * 0.05); // 5% GST
  
  const offerToUse = activeOrder?.appliedOffer || appliedOffer;
  const promoName = offerToUse ? offerToUse.name : "Special Offer";
  const promoDescription = offerToUse?.benefit?.type === "flat"
    ? `Flat ₹${offerToUse.benefit.value} off on your order`
    : `${offerToUse?.benefit?.value || 10}% off your order`;

  const discount = isOfferApplied && offerToUse
    ? (offerToUse.benefit?.type === "flat"
        ? Math.min(Number(offerToUse.benefit.value) || 0, itemTotal)
        : Math.round((itemTotal * (Number(offerToUse.benefit?.value) || 0)) / 100))
    : (activeOrder?.discount || currentSession?.discount || 0);

  const grandTotal = (currentSession?.total !== undefined && currentSession?.total !== null && !isOfferApplied)
    ? currentSession.total
    : Math.max(itemTotal + gstAmount - discount, 0);
  const isMobileRequired = isOfferApplied;

  const handleApplyPromo = () => {
    if (!mobile.verified) {
      toast.info("Please verify your mobile number to avail offers.");
      openOffersModal();
      return;
    }
    applyOffer();
  };

  const handleReceiveOrder = () => {
    completeActiveOrder();
    toast.success("Order acknowledged! Enjoy your meal 🍽️");
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader
        title={displayTableName}
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

      {!activeOrder && (!sessionOrders || sessionOrders.length === 0) ? (
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
          {activeOrder && (
            <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-base font-bold text-text-primary mb-0.5">
                    Current order
                  </h2>
                  <p className="text-[11px] text-text-muted">
                    {activeOrder.items.length}{" "}
                    {activeOrder.items.length === 1 ? "dish" : "dishes"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-success-light text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    {activeOrder.status === "delivered" && <CheckCircle2 size={12} />}
                    {statusLabel[activeOrder.status] || "Active"}
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
                  const isActive = index === currentIndex && activeOrder.status !== "delivered";
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

              {/* Itemized List of Dishes */}
              <div className="mt-2 pt-4 border-t border-border-light space-y-2">
                <p className="text-xs font-bold text-text-primary mb-2">Dishes in this order</p>
                <div className="space-y-1.5 bg-surface-soft/40 rounded-xl p-3 border border-border-light/50">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs py-0.5">
                      <span className="text-text-secondary flex items-center gap-2 flex-1 pr-3">
                        <span className="font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">
                          {item.quantity}x
                        </span>
                        <span className="leading-snug font-medium text-text-primary">
                          {item.title || item.name}
                        </span>
                      </span>
                      <span className="text-text-primary font-semibold shrink-0">
                        ₹{(item.price || 0) * (item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Action */}
              {activeOrder.status === "ready" && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="button"
                  onClick={handleReceiveOrder}
                  className="mt-4 w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                  <CheckCircle2 size={18} />
                  I&apos;ve received my order
                </motion.button>
              )}

              {activeOrder.status === "delivered" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-success-light border border-primary/20 text-center space-y-2.5"
                >
                  <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
                    <CheckCircle2 size={18} />
                    <span>Order Served &amp; Received</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    All dishes have been delivered to your table. Enjoy your meal!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("Menu")}
                    className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary font-bold text-xs rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
                  >
                    <UtensilsCrossed size={15} />
                    Order More Dishes
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Multiple Order Rounds at this Table */}
          {sessionOrders && sessionOrders.length > 1 && (
            <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-text-primary">
                  Order Rounds
                </h2>
                <span className="text-xs text-text-muted font-medium bg-surface-soft border border-border-light px-2.5 py-0.5 rounded-full">
                  {sessionOrders.length} rounds placed
                </span>
              </div>
              <div className="space-y-4">
                {sessionOrders.map((order, idx) => {
                  const orderNum = order.orderNumber || idx + 1;
                  const isOrderServed = (order.items || []).every(
                    (i) => i.status === "served" || i.status === "cancelled"
                  );
                  const isOrderPending = (order.items || []).some((i) => i.status === "pending");

                  return (
                    <div key={order._id || idx} className="border-b border-border-light pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-primary">Round #{idx + 1} (Order #{orderNum})</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isOrderServed
                              ? "bg-success-light text-primary"
                              : isOrderPending
                              ? "bg-amber-100 text-amber-700"
                              : "bg-primary/10 text-primary"
                          }`}>
                            {isOrderServed ? "Served" : isOrderPending ? "Received" : "Preparing"}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-text-primary">₹{order.total}</span>
                      </div>
                      <div className="space-y-1.5 bg-surface-soft/40 rounded-xl p-3 border border-border-light/50">
                        {(order.items || []).map((item, itemIdx) => {
                          const liveQty = Math.max(0, (item.quantity || 0) - (item.cancelledQty || 0));
                          if (liveQty <= 0) return null;
                          return (
                            <div key={item._id || itemIdx} className="flex justify-between items-start text-xs">
                              <span className="text-text-secondary flex gap-2 flex-1 pr-3">
                                <span className="font-semibold text-primary">{liveQty}x</span>
                                <span className="leading-snug">{item.name || item.title}</span>
                              </span>
                              <span className="text-text-primary font-medium shrink-0">
                                ₹{item.price * liveQty}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Offer Section */}
          {isOfferApplied ? (
            <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-success-light flex items-center justify-center">
                  <Tag size={15} className="text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    {promoName} applied
                  </span>
                  <p className="text-[11px] text-text-muted">
                    {promoDescription}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">
                    -₹{discount}
                  </span>
                  <button onClick={removeOffer} className="p-1.5 hover:bg-danger/10 text-text-muted hover:text-danger rounded-full transition-colors active:scale-95">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-soft border border-border-light flex items-center justify-center">
                    <Tag size={15} className="text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Have a promo code?</h3>
                    <p className="text-[11px] text-text-muted">Apply offers to get a discount</p>
                  </div>
               </div>
                <button onClick={handleApplyPromo} className="text-primary text-xs font-bold px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all active:scale-95">
                  Apply
                </button>
            </div>
          )}

          {/* Mobile Verification to Avail Offers */}
          <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
            {!mobile.verified ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-text-primary">
                      Avail Offers &amp; Updates
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      To apply discount offers and receive live order updates on WhatsApp, please add your mobile number.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openOffersModal}
                  className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-primary font-bold text-xs rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
                >
                  <MessageCircle size={15} />
                  Add Mobile to Avail Offers
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-success-light flex items-center justify-center">
                    <ShieldCheck size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-text-primary">
                      Mobile Verified
                    </h3>
                    <p className="text-xs font-semibold text-primary">
                      +91 {mobile.number}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-success-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Linked
                  </span>
                </div>
                <p className="text-[11px] text-text-muted bg-success-light/50 rounded-xl p-2.5 text-center mt-2">
                  Order updates &amp; table offers are active on WhatsApp
                </p>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BadgePercent size={16} className="text-text-muted" />
              <h3 className="text-sm font-bold text-text-primary">
                Bill Summary
              </h3>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary font-medium">Items Total</span>
                <span className="font-semibold text-text-primary">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Taxes (GST 5%)</span>
                <span className="font-medium text-text-primary">₹{gstAmount}</span>
              </div>

              {isOfferApplied && discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    Offer discount
                    <Sparkles size={12} className="text-primary" />
                  </span>
                  <span className="font-semibold text-primary">-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-border-light pt-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-text-primary">
                  Total Bill
                </span>
                <span className="text-xl font-extrabold text-text-primary">
                  ₹{grandTotal}
                </span>
              </div>
              <p className="text-[11px] text-text-muted text-center pt-3 border-t border-dashed border-border-light/60 mt-3">
                Please pay at counter when you finish dining. Restaurant staff will close the session.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Rate Experience */}
      <button
        type="button"
        onClick={() => {
          setActiveTab("Rating");
          if (pathname) {
            const newParams = new URLSearchParams(searchParams?.toString() || "");
            newParams.set("tab", "rating");
            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
          }
        }}
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

      {/* Social Media Links */}
      <div className="pt-2 pb-6 flex flex-col items-center justify-center gap-3">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Connect with us</p>
        <div className="flex items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-surface shadow-sm border border-border-light flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
}