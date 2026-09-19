"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  ChevronRight,
  History,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ShoppingBag,
  Tag,
  Sparkles,
  ShieldCheck,
  BadgePercent,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

const APPLIED_PROMO = "WELCOME10";
const PROMO_RATE = 0.1;

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
  const {
    tableId,
    cartItems,
    subtotal,
    setActiveTab,
    increment,
    decrement,
    removeItem,
    mobile,
    setMobileNumber,
    sendOtp,
    verifyOtp,
    placeOrder,
  } = useMenuOrder();

  const [otpValue, setOtpValue] = useState("");

  const discount = Math.round(subtotal * PROMO_RATE);
  const total = Math.max(subtotal - discount, 0);

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

  const handlePlaceOrder = () => {
    const result = placeOrder();
    if (!result.ok) {
      toast.error(result.error ?? "Couldn't place the order");
      return;
    }
    toast.success("Order placed! Track it on the Table tab.");
    setActiveTab("Table");
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
            <span>Table {tableId ?? "05"}</span>
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

          {/* Applied Offer */}
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
              <span className="text-sm font-bold text-primary">
                -₹{discount}
              </span>
            </div>
          </div>

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
                    : "Required to place your order"}
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
                  We'll send a one-time code on WhatsApp.
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
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary flex items-center gap-1.5">
                  Offer discount
                  <Sparkles size={12} className="text-primary" />
                </span>
                <span className="font-semibold text-primary">
                  -₹{discount}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-border-light pt-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-text-primary">
                  Total to pay
                </span>
                <span className="text-xl font-extrabold text-text-primary">
                  ₹{total}
                </span>
              </div>
            </div>

            <div className="bg-surface-soft rounded-xl p-3 mb-3">
              <p className="text-[11px] text-text-muted text-center leading-relaxed">
                Payment is collected manually by the restaurant after your order
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!mobile.verified}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-border disabled:cursor-not-allowed disabled:text-text-muted active:scale-[0.98] text-text-on-primary font-bold rounded-xl py-4 flex items-center justify-center transition-all shadow-lg shadow-primary/20 disabled:shadow-none"
            >
              {mobile.verified
                ? `Place order · ₹${total}`
                : "Verify mobile to place order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;