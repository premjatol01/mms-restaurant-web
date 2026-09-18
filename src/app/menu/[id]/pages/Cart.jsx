"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  ChevronRight,
  History,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import EmptyState from "@/components/menuComp/EmptyState";

const VALID_PROMO = "WELCOME10";
const PROMO_RATE = 0.1;

function OrderItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className="bg-surface rounded-xl p-3 shadow-sm border border-border-light flex items-start gap-3">
      <div className="w-14 h-14 rounded-lg bg-surface-soft flex items-center justify-center flex-shrink-0 overflow-hidden border border-border-light">
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
        <p className="text-xs text-text-muted mt-0.5">₹{item.price} each</p>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-surface w-fit">
            <button
              type="button"
              onClick={() => onDecrement(item.id)}
              aria-label="Decrease quantity"
              className="px-2.5 py-1.5 text-text-secondary hover:bg-surface-soft transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="px-3 py-1 text-sm font-semibold text-text-primary">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrement(item)}
              aria-label="Increase quantity"
              className="px-2.5 py-1.5 text-text-secondary hover:bg-surface-soft transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
            className="text-text-muted hover:text-danger transition-colors p-1.5"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
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

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const discount = appliedPromo ? Math.round(subtotal * PROMO_RATE) : 0;
  const total = Math.max(subtotal - discount, 0);

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === VALID_PROMO) {
      setAppliedPromo(true);
      toast.success("Promo code applied — 10% off");
    } else {
      toast.error("That promo code isn't valid");
    }
  };

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
        trailing={
          <span className="text-xs font-bold text-primary">
            Table {tableId ?? "05"}
          </span>
        }
      />

      {/* Order History Banner */}
      <button
        type="button"
        onClick={() => setActiveTab("History")}
        className="w-full bg-success-light border border-primary-light/30 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-success-light/70 transition-colors text-left"
      >
        <div className="flex items-center">
          <div className="bg-surface rounded-lg p-1.5 mr-3 shadow-sm border border-border-light">
            <History size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-primary font-bold text-sm">Order History</h3>
            <p className="text-primary/80 text-[11px] mt-0.5">
              View your previous orders
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-primary" />
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
            {cartItems.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Promo code */}
          {appliedPromo ? (
            <div className="bg-surface rounded-xl p-3 shadow-sm border border-border-light flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle size={18} className="text-primary mr-2" />
                <div>
                  <span className="text-xs font-bold text-primary mr-2">
                    {VALID_PROMO} applied
                  </span>
                  <span className="text-[10px] text-text-muted">
                    You're saving ₹{discount} on this order
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAppliedPromo(false);
                  setPromoInput("");
                }}
                className="text-xs font-bold text-danger"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-3 shadow-sm border border-border-light flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Have a promo code? (try WELCOME10)"
                className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold px-4 py-2 rounded-lg transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          )}

          {/* Mobile Number Verification */}
          <div className="bg-success-light border border-primary-light/30 rounded-2xl p-4">
            <div className="flex items-center mb-3">
              <MessageCircle size={16} className="text-primary mr-2" />
              <h3 className="text-xs font-bold text-primary">
                {mobile.verified
                  ? "Mobile number verified"
                  : "Verify your mobile to place the order"}
              </h3>
            </div>

            {mobile.verified ? (
              <p className="text-xs text-primary/80">
                +91 {mobile.number} · updates will be sent on WhatsApp.
              </p>
            ) : !mobile.otpSent ? (
              <>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mobile.number}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="flex-1 min-w-0 bg-surface border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    Send OTP
                  </button>
                </div>
                <p className="text-[10px] text-primary/70 mt-2">
                  We'll send a one-time code on WhatsApp.
                </p>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="4-digit code"
                    className="flex-1 min-w-0 bg-surface border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
                  >
                    Verify
                  </button>
                </div>
                <p className="text-[10px] text-primary/70 mt-2">
                  Sent to +91 {mobile.number}. Any 4 digits work in this demo.
                </p>
              </>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary">₹{subtotal}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Promo discount</span>
                  <span className="font-medium text-text-primary">-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-border-light pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-text-primary">
                  Total to pay
                </span>
                <span className="text-base font-bold text-text-primary">₹{total}</span>
              </div>
            </div>

            <div className="bg-success-light rounded-xl p-3 text-center mb-3">
              <p className="text-[10px] text-primary">
                Payment is collected manually by the restaurant after your table
                order.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!mobile.verified}
              className="w-full bg-primary hover:bg-primary-hover disabled:bg-border disabled:cursor-not-allowed disabled:text-text-muted active:scale-[0.99] text-text-on-primary font-bold rounded-xl py-4 flex items-center justify-center transition-all"
            >
              {mobile.verified
                ? "Place order"
                : "Verify mobile number to place order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
