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
    label: "Ready",
    note: "We&apos;ll let you know",
    icon: Bell,
  },
];

const statusLabel = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
};

export default function TableSession() {
  const { 
    tableId, 
    activeOrder, 
    orderHistory, 
    setActiveTab, 
    completeActiveOrder,
    mobile,
    setMobileNumber,
    sendOtp,
    verifyOtp,
    isOfferApplied,
    removeOffer,
    applyOffer,
  } = useMenuOrder();

  const [otpValue, setOtpValue] = useState("");

  const currentIndex = activeOrder
    ? STEPS.findIndex((s) => s.key === activeOrder.status)
    : -1;

  const previousTotal = orderHistory.reduce((sum, order) => sum + order.total, 0);
  const currentTotal = activeOrder ? activeOrder.total : 0;
  const itemTotal = currentTotal + previousTotal;
  
  const gstAmount = Math.round(itemTotal * 0.05); // 5% GST
  
  const discount = isOfferApplied ? Math.round(itemTotal * PROMO_RATE) : 0;
  const grandTotal = Math.max(itemTotal + gstAmount - discount, 0);
  const isMobileRequired = isOfferApplied;

  const handleSendOtp = () => {
    const result = sendOtp();
    if (!result.ok) toast.error(result.error);
    else toast.success("OTP sent on WhatsApp");
  };

  const handleVerifyOtp = () => {
    const result = verifyOtp(otpValue);
    if (!result.ok) toast.error(result.error);
    else toast.success("Mobile number verified");
  };

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

      {!activeOrder && orderHistory.length === 0 ? (
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
                  I&apos;ve received my order
                </motion.button>
              )}
            </div>
          )}

          {/* Previous Records */}
          {orderHistory.length > 0 && (
            <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
              <h2 className="text-base font-bold text-text-primary mb-4">
                Previous records
              </h2>
              <div className="space-y-4">
                {orderHistory.map((order) => {
                  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  
                  return (
                    <div key={order.id} className="border-b border-border-light pb-4 last:border-0 last:pb-0">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-primary">Order #{order.id.slice(-4)}</p>
                          <span className="text-[10px] font-medium text-text-muted bg-surface-soft border border-border-light px-1.5 py-0.5 rounded">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-text-primary">₹{order.total}</span>
                      </div>

                      {/* Itemized List */}
                      <div className="space-y-2 bg-surface-soft/40 rounded-xl p-3 border border-border-light/50">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start text-xs">
                            <span className="text-text-secondary flex gap-2 flex-1 pr-3">
                              <span className="font-semibold text-primary">{item.quantity}x</span>
                              <span className="leading-snug">{item.title}</span>
                            </span>
                            <span className="text-text-primary font-medium shrink-0">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
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
                    {APPLIED_PROMO} applied
                  </span>
                  <p className="text-[11px] text-text-muted">
                    10% off your first order
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
               <button onClick={applyOffer} className="text-primary text-xs font-bold px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all active:scale-95">
                 Apply
               </button>
            </div>
          )}

          {/* Mobile Verification */}
          <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  mobile.verified ? "bg-success-light" : "bg-warning/10"
                }`}
              >
                {mobile.verified ? (
                  <ShieldCheck size={16} className="text-primary" />
                ) : (
                  <MessageCircle size={16} className="text-warning" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-text-primary">
                  {mobile.verified
                    ? "Mobile verified"
                    : "Verify your mobile"}
                </h3>
                <p className="text-[11px] text-text-muted">
                  {mobile.verified
                    ? `+91 ${mobile.number}`
                    : isMobileRequired 
                        ? "Required for offer" 
                        : "Optional"}
                </p>
              </div>
            </div>

            {mobile.verified ? (
              <p className="text-[11px] text-text-muted bg-success-light/50 rounded-xl p-2.5 text-center">
                Order updates will be sent on WhatsApp
              </p>
            ) : !mobile.otpSent ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile.number}
                    onChange={(e) =>
                      setMobileNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="10-digit number"
                    className="flex-1 min-w-0 bg-surface-soft border border-transparent rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-surface focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all shrink-0"
                  >
                    Send OTP
                  </button>
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  We&apos;ll send a one-time code on WhatsApp.
                </p>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={otpValue}
                    onChange={(e) =>
                      setOtpValue(
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    placeholder="4-digit code"
                    className="flex-1 min-w-0 bg-surface-soft border border-transparent rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:bg-surface focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all shrink-0"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-[10px] text-text-muted mt-2">
                  Sent to +91 {mobile.number} · Any 4 digits work in this demo
                </p>
              </>
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
              {currentTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Current Order</span>
                  <span className="font-medium text-text-primary">₹{currentTotal}</span>
                </div>
              )}
              {previousTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Previous Orders</span>
                  <span className="font-medium text-text-primary">₹{previousTotal}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm pt-2 border-t border-border-light/50">
                <span className="text-text-secondary font-medium">Items Total</span>
                <span className="font-semibold text-text-primary">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Taxes (GST 5%)</span>
                <span className="font-medium text-text-primary">₹{gstAmount}</span>
              </div>

              {isOfferApplied && (
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
            </div>
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