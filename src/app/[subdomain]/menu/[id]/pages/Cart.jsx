"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
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
  AlertCircle,
  Phone,
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subdomain = params?.subdomain;

  const {
    tableId,
    tableName,
    verifiedTable,
    verifiedRestaurant,
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
    setMobileNumber,
    openOffersModal,
    activeOrder,
    currentSession,
    isSubmittingOrder,
  } = useMenuOrder();

  const [mobileInput, setMobileInput] = useState(
    mobile?.number ? String(mobile.number).replace(/\D/g, "").slice(-10) : ""
  );

  useEffect(() => {
    if (mobile?.number) {
      setMobileInput(String(mobile.number).replace(/\D/g, "").slice(-10));
    }
  }, [mobile?.number]);

  const cleanDigits = String(mobileInput || mobile?.number || "").replace(/\D/g, "").slice(-10);

  const rawTable = verifiedTable?.tableName || verifiedTable?.tableNo || verifiedTable?.name || (tableName && tableName.length !== 24 ? tableName : null);
  const displayTableName = formatTableName(rawTable, "Table");

  // If no offer is selected, check eligibility and auto-suggest the best qualified offer (strictly requires verified phone)
  useEffect(() => {
    const hasPhone = mobile?.verified || (cleanDigits.length >= 10);
    if (!subdomain || cartItems.length === 0 || appliedOffer || !hasPhone) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const tableSpend = (currentSession?.subtotal ?? activeOrder?.total ?? 0) + subtotal;

    fetch(`${apiUrl}/public/offers/check-eligibility`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: subdomain,
        mobile: cleanDigits.length === 10 ? cleanDigits : null,
        currentOrderTotal: tableSpend,
        items: cartItems
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          const eligibleOffers = json.data.filter((o) => o.isEligible);
          if (eligibleOffers.length > 0) {
            eligibleOffers.sort((a, b) => (b.potentialDiscount || 0) - (a.potentialDiscount || 0));
            setAppliedOffer(eligibleOffers[0]);
          }
        }
      })
      .catch(() => {});
  }, [subdomain, cartItems.length, appliedOffer, subtotal, activeOrder?.total, cleanDigits, setAppliedOffer]);

  const handlePlaceOrder = async () => {
    if (!cleanDigits || cleanDigits.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number to place your order.");
      return;
    }

    if (setMobileNumber) {
      setMobileNumber(cleanDigits);
    }

    const result = await placeOrder({
      subdomain,
      tableId: params?.id || tableId,
      mobile: cleanDigits,
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

  const handleBack = () => {
    setActiveTab("Home");
    if (pathname) {
      const newParams = new URLSearchParams(searchParams?.toString() || "");
      newParams.set("tab", "home");
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
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
        onBack={handleBack}
        trailing={
          <div className="flex items-center gap-1 bg-success-light text-primary text-[11px] font-bold px-2.5 py-1.5 rounded-full">
            <span>{displayTableName}</span>
          </div>
        }
      />

      {/* History Banner */}
      <button
        type="button"
        onClick={() => {
          setActiveTab("History");
          if (pathname) {
            const newParams = new URLSearchParams(searchParams?.toString() || "");
            newParams.set("tab", "history");
            router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
          }
        }}
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

          {/* Customer Mobile Number (Compulsory) */}
          <div className="bg-surface rounded-2xl p-4 border border-border-light shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-1">
                    Mobile Number <span className="text-danger font-black">*</span>
                  </h4>
                  <p className="text-[10px] text-text-muted">
                    Compulsory to track orders & shift tables
                  </p>
                </div>
              </div>
              {mobile?.verified && cleanDigits.length === 10 ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              ) : (
                <span className="text-[10px] font-bold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                  Required
                </span>
              )}
            </div>

            <div className="flex items-center bg-surface-soft border border-border focus-within:border-primary rounded-xl px-3 py-2.5 transition-colors">
              <span className="text-xs font-bold text-text-secondary mr-2 shrink-0 select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={mobileInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobileInput(val);
                  if (setMobileNumber) setMobileNumber(val);
                }}
                className="w-full text-xs font-medium bg-transparent outline-none text-text-primary placeholder:text-text-muted"
              />
              {cleanDigits.length === 10 && !mobile?.verified && (
                <button
                  type="button"
                  onClick={() => openOffersModal("phone")}
                  className="text-[11px] font-bold text-primary hover:underline shrink-0 ml-2"
                >
                  Verify OTP
                </button>
              )}
            </div>
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

            {verifiedRestaurant?.settings?.acceptOrders === false && (
              <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-amber-700 dark:text-amber-400">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-xs">Orders Temporarily Paused</p>
                  <p className="text-[11px] leading-snug opacity-90">
                    This restaurant is currently not accepting new orders online. Please check with your server.
                  </p>
                </div>
              </div>
            )}

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
              disabled={isSubmittingOrder || verifiedRestaurant?.settings?.acceptOrders === false}
              className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-text-on-primary font-bold rounded-xl py-4 flex items-center justify-between px-6 transition-all shadow-lg shadow-primary/20"
            >
              <span>
                {verifiedRestaurant?.settings?.acceptOrders === false
                  ? "Orders Paused"
                  : isSubmittingOrder
                  ? "Placing order..."
                  : cleanDigits.length !== 10
                  ? "Enter Mobile to Order"
                  : "Place order"}
              </span>
              <span className="font-extrabold">₹{finalTotal}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;