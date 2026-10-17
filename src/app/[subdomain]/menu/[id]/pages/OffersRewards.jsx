"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Tag,
  CheckCircle,
  MessageSquare,
  History,
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw,
  Gift,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import { toast } from "sonner";

const getIconForType = (type) => {
  switch (type) {
    case "repeat_order":
      return History;
    case "order_value":
      return TrendingUp;
    case "low_traffic":
      return Calendar;
    default:
      return Sparkles;
  }
};

const getDiscountText = (offer) => {
  if (offer.benefit?.type === "flat") {
    return `₹${offer.benefit.value} OFF`;
  }
  return `${offer.benefit?.value || 0}% OFF`;
};

const getFallbackOffers = (mobile, tableSpend, isTuesday, hasQualifyingPastOrder) => [
  {
    id: "repeat_order",
    name: "Repeat Order Offer",
    type: "repeat_order",
    benefit: { type: "percentage", value: 10 },
    discountText: "10% OFF",
    terms: "Get 10% off when you re-order within 7 days of a past order above ₹1,000.",
    isEligible: mobile.verified && hasQualifyingPastOrder,
    eligibilityText: hasQualifyingPastOrder
      ? "You qualify for this offer based on your recent order!"
      : "Requires a previous order over ₹1,000 in the last 7 days."
  },
  {
    id: "order_value",
    name: "Value-Based Offer",
    type: "order_value",
    benefit: { type: "percentage", value: 15 },
    discountText: "15% OFF",
    terms: "Get 15% off on your entire bill when your order value reaches ₹1,500.",
    isEligible: mobile.verified && tableSpend >= 1500,
    eligibilityText: tableSpend >= 1500
      ? "Eligible based on your current cart value!"
      : `Add ₹${Math.max(0, 1500 - tableSpend)} more to qualify.`
  },
  {
    id: "low_traffic",
    name: "Tuesday Special",
    type: "low_traffic",
    benefit: { type: "percentage", value: 20 },
    discountText: "20% OFF",
    terms: "Get 20% off on all orders above ₹1,000 placed on Tuesdays.",
    isEligible: mobile.verified && isTuesday && tableSpend >= 1000,
    eligibilityText: isTuesday
      ? tableSpend >= 1000
        ? "Eligible for Tuesday Special!"
        : `Add ₹${Math.max(0, 1000 - tableSpend)} more to qualify.`
      : "Valid only on Tuesdays."
  }
];

const OffersRewards = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    mobile,
    subtotal,
    cartItems,
    activeOrder,
    currentSession,
    orderHistory,
    openOffersModal,
    appliedOffer,
    isOfferApplied,
    setAppliedOffer,
    setActiveTab,
    verifiedRestaurant,
  } = useMenuOrder();

  const subdomain = params?.subdomain || verifiedRestaurant?.subdomain;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableSpend = (currentSession?.subtotal ?? activeOrder?.total ?? 0) + subtotal;
  const hasQualifyingPastOrder =
    (orderHistory || []).length > 0 &&
    orderHistory.some((o) => (o?.total ?? 0) >= 1000);
  const isTuesday = new Date().getDay() === 2;

  // Build a stable fingerprint of cart items by ID, quantity, and price
  const cartFingerprint = useMemo(() => {
    return (cartItems || [])
      .map((i) => `${i.id || i._id}:${i.quantity}:${i.price}`)
      .sort()
      .join("|");
  }, [cartItems]);

  // Composite key representing the exact state of order, cart, session, and customer verification
  const orderKey = useMemo(() => {
    const orderId = activeOrder?.id || activeOrder?.sessionId || "no-order";
    const orderStatus = activeOrder?.status || "none";
    const mobileKey = mobile?.verified ? (mobile.number || "verified") : "unverified";
    return `${subdomain}_${mobileKey}_${tableSpend}_${orderId}_${orderStatus}_${cartFingerprint}`;
  }, [
    subdomain,
    mobile?.verified,
    mobile?.number,
    tableSpend,
    activeOrder?.id,
    activeOrder?.sessionId,
    activeOrder?.status,
    cartFingerprint,
  ]);

  const isFetchingRef = useRef(false);
  const lastCheckedKeyRef = useRef("");

  const fetchAndCheckOffers = useCallback(
    async (isManualRefresh = false) => {
      if (!subdomain) return;
      // Skip if this exact order state has already been evaluated, unless user clicked manual refresh
      if (!isManualRefresh && lastCheckedKeyRef.current === orderKey) {
        return;
      }
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      lastCheckedKeyRef.current = orderKey;
      setLoading(true);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      try {
        // Call public check-eligibility endpoint
        const res = await fetch(`${apiUrl}/public/offers/check-eligibility`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: subdomain,
            mobile: mobile?.verified ? mobile.number : null,
            currentOrderTotal: tableSpend,
            items: (cartItems || []).map((i) => ({
              id: i.id || i._id,
              name: i.name || i.title,
              price: i.price,
              quantity: i.quantity,
            })),
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setOffers(
              json.data.map((offer) => ({
                ...offer,
                discountText: getDiscountText(offer),
              }))
            );
            setLoading(false);
            return;
          }
        }

        // Fallback: If no server offers found, try GET /public/offers/:id
        const publicRes = await fetch(
          `${apiUrl}/public/offers/${encodeURIComponent(subdomain)}`
        );
        if (publicRes.ok) {
          const pubJson = await publicRes.json();
          if (
            pubJson.success &&
            Array.isArray(pubJson.data) &&
            pubJson.data.length > 0
          ) {
            setOffers(
              pubJson.data.map((offer) => ({
                ...offer,
                discountText: getDiscountText(offer),
                isEligible: false,
                eligibilityText:
                  offer.terms || "Check order conditions to unlock.",
              }))
            );
            setLoading(false);
            return;
          }
        }

        // Final fallback to mock offers
        setOffers(
          getFallbackOffers(
            mobile,
            tableSpend,
            isTuesday,
            hasQualifyingPastOrder
          )
        );
      } catch (err) {
        console.warn("Failed checking offer eligibility:", err);
        setOffers(
          getFallbackOffers(
            mobile,
            tableSpend,
            isTuesday,
            hasQualifyingPastOrder
          )
        );
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [
      subdomain,
      orderKey,
      mobile,
      tableSpend,
      cartItems,
      isTuesday,
      hasQualifyingPastOrder,
    ]
  );

  // Trigger evaluation only on mount or when order state updates
  useEffect(() => {
    fetchAndCheckOffers(false);
  }, [fetchAndCheckOffers]);

  const handleBack = () => {
    setActiveTab("Home");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "home");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Offers & Rewards"
          subtitle="Automatically calculated for your order"
          showBack={true}
          onBack={handleBack}
        />
        <button
          type="button"
          onClick={() => fetchAndCheckOffers(true)}
          disabled={loading}
          className="p-2 text-text-muted hover:text-primary transition-colors active:scale-95 rounded-full hover:bg-surface-soft"
          title="Refresh offers"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Login Alert */}
      {!mobile.verified && (
        <div className="bg-warning-light border border-warning/30 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare size={16} className="text-warning" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-bold text-text-primary">
              Verify to Unlock Exclusive Discounts
            </h3>
            <p className="text-text-secondary text-[11px] mt-1 mb-3 leading-relaxed">
              Verify your mobile number via WhatsApp OTP to unlock repeat customer rewards and personalize your order experience.
            </p>
            <button
              type="button"
              onClick={openOffersModal}
              className="text-xs font-bold text-white bg-warning hover:opacity-90 px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm w-fit"
            >
              Verify Mobile
            </button>
          </div>
        </div>
      )}

      {/* Current Spend Context */}
      <div className="bg-surface rounded-2xl p-3.5 border border-border-light flex items-center justify-between text-xs text-text-secondary">
        <span className="flex items-center gap-1.5 font-medium">
          <Gift size={15} className="text-primary" />
          Current Table Order Value:
        </span>
        <span className="font-bold text-text-primary text-sm">
          ₹{tableSpend}
        </span>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {loading && offers.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-primary" />
            Loading offers...
          </div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm bg-surface rounded-2xl border border-border-light">
            No active offers at this moment. Check back soon!
          </div>
        ) : (
          offers.map((offer) => {
            const Icon = getIconForType(offer.type);
            const eligible = offer.isEligible;

            return (
              <div
                key={offer.id || offer._id}
                className={`bg-surface rounded-2xl p-5 border shadow-sm transition-all ${
                  eligible ? "border-primary bg-primary/5" : "border-border-light"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                      eligible ? "bg-primary text-white" : "bg-surface-soft text-text-muted"
                    }`}
                  >
                    <Tag size={11} />
                    {offer.discountText}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      eligible ? "bg-primary text-white" : "bg-surface-soft text-text-muted"
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                </div>

                <h2 className="text-base font-bold text-text-primary mb-1">
                  {offer.name}
                </h2>
                <p className="text-text-muted text-xs mb-4 leading-relaxed">
                  {offer.terms || "Special promotional offer applied to eligible orders."}
                </p>

                {eligible ? (
                  <div className="space-y-3">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={15} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-primary font-bold text-xs">
                            Offer Unlocked!
                          </h4>
                          <p className="text-primary/80 text-[11px]">
                            {offer.eligibilityText || "Applies automatically at checkout"}
                          </p>
                        </div>
                      </div>
                      {offer.potentialDiscount > 0 && (
                        <span className="text-xs font-bold text-primary bg-white px-2 py-1 rounded-md shadow-xs shrink-0">
                          Save ₹{offer.potentialDiscount}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end pt-1">
                      {appliedOffer && (appliedOffer.id === offer.id || appliedOffer._id === offer._id || appliedOffer.name === offer.name) && isOfferApplied ? (
                        <span className="text-xs font-bold text-primary bg-primary/15 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                          <CheckCircle size={13} />
                          Applied in Cart
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedOffer(offer);
                            toast.success(`"${offer.name}" applied to your order!`);
                            setActiveTab("Cart");
                            if (pathname) {
                              const newParams = new URLSearchParams(searchParams?.toString() || "");
                              newParams.set("tab", "cart");
                              router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
                            }
                          }}
                          className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                        >
                          Apply to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-soft rounded-xl p-3">
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {!mobile.verified && offer.type === "repeat_order"
                        ? "Verify your mobile number to unlock this repeat customer offer."
                        : offer.eligibilityText || "Order doesn't meet the qualification criteria yet."}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OffersRewards;