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
  ArrowRight,
  ChevronDown,
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
  const [showComparison, setShowComparison] = useState(true);

  const tableSpend = (currentSession?.subtotal ?? activeOrder?.total ?? 0) + subtotal;

  const isPhoneReady = Boolean(
    mobile?.verified || (mobile?.number && String(mobile.number).replace(/\D/g, "").length >= 10)
  );

  // Build a stable fingerprint of cart items by ID, quantity, and price
  const cartFingerprint = useMemo(() => {
    return (cartItems || [])
      .map((i) => `${i.id || i._id}:${i.quantity}:${i.price}`)
      .sort()
      .join("|");
  }, [cartItems]);

  const orderKey = useMemo(() => {
    const orderId = activeOrder?.id || activeOrder?.sessionId || "no-order";
    const orderStatus = activeOrder?.status || "none";
    const mobileKey = isPhoneReady ? mobile.number : "unverified";
    return `${subdomain}_${mobileKey}_${tableSpend}_${orderId}_${orderStatus}_${cartFingerprint}`;
  }, [subdomain, isPhoneReady, mobile?.number, tableSpend, activeOrder?.id, activeOrder?.sessionId, activeOrder?.status, cartFingerprint]);

  const isFetchingRef = useRef(false);
  const lastCheckedKeyRef = useRef("");

  const computeOfferSavings = useCallback(
    (rawList) => {
      if (!Array.isArray(rawList)) return [];
      return rawList.map((offer) => {
        let potential = offer.potentialDiscount;
        if (potential === undefined || potential === null || potential === 0) {
          if (offer.benefit?.type === "flat") {
            potential = Math.min(Number(offer.benefit?.value) || 0, tableSpend);
          } else {
            const pct = Number(offer.benefit?.value) || 0;
            potential = Math.round(((tableSpend * pct) / 100) * 100) / 100;
          }
        }
        return {
          ...offer,
          potentialDiscount: potential || 0,
          discountText: getDiscountText(offer),
        };
      });
    },
    [tableSpend]
  );

  const fetchAndCheckOffers = useCallback(
    async (isManualRefresh = false) => {
      if (!subdomain) return;
      if (!isManualRefresh && lastCheckedKeyRef.current === orderKey) {
        return;
      }
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      lastCheckedKeyRef.current = orderKey;
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      try {
        const res = await fetch(`${apiUrl}/public/offers/check-eligibility`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: subdomain,
            mobile: isPhoneReady ? mobile.number : null,
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
            setOffers(computeOfferSavings(json.data));
            setLoading(false);
            return;
          }
        }

        // Secondary fallback to standard public offers list
        const publicRes = await fetch(
          `${apiUrl}/public/offers/${encodeURIComponent(subdomain)}`
        );
        if (publicRes.ok) {
          const pubJson = await publicRes.json();
          if (pubJson.success && Array.isArray(pubJson.data) && pubJson.data.length > 0) {
            setOffers(
              computeOfferSavings(
                pubJson.data.map((o) => ({
                  ...o,
                  isEligible: isPhoneReady,
                  eligibilityText: o.terms || "Check order conditions to unlock.",
                }))
              )
            );
            setLoading(false);
            return;
          }
        }

        // Restaurant has no offers configured
        setOffers([]);
      } catch (err) {
        console.warn("Failed fetching restaurant offers:", err);
        setOffers([]);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [subdomain, orderKey, isPhoneReady, mobile?.number, tableSpend, cartItems, computeOfferSavings]
  );

  useEffect(() => {
    fetchAndCheckOffers(false);
  }, [fetchAndCheckOffers]);

  // Determine best offer based on highest potential discount
  const bestOffer = useMemo(() => {
    if (!offers || offers.length === 0) return null;
    const sorted = [...offers].sort((a, b) => (b.potentialDiscount || 0) - (a.potentialDiscount || 0));
    return sorted[0];
  }, [offers]);

  const handleBack = () => {
    setActiveTab("Home");
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", "home");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleAvailOffer = (offer) => {
    // Requirement: Make sure without phone number offer should not be applied!
    if (!isPhoneReady) {
      toast.info("Please enter your mobile number to apply this offer.");
      openOffersModal("offers");
      return;
    }

    const applied = setAppliedOffer(offer);
    if (applied !== false) {
      toast.success(`"${offer.name}" availed! Save ₹${offer.potentialDiscount || 0}`);
      const targetTab = (cartItems && cartItems.length > 0) ? "Cart" : "Table";
      setActiveTab(targetTab);
      if (pathname) {
        const newParams = new URLSearchParams(searchParams?.toString() || "");
        newParams.set("tab", targetTab.toLowerCase());
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
      }
    }
  };

  const isCurrentOfferApplied = (offer) => {
    if (!isOfferApplied || !appliedOffer) return false;
    return (
      (offer.id && appliedOffer.id === offer.id) ||
      (offer._id && appliedOffer._id === offer._id) ||
      appliedOffer.name === offer.name
    );
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Offers & Rewards"
          subtitle="Best offers calculated automatically for your table"
          showBack={true}
          onBack={handleBack}
        />
        <button
          type="button"
          onClick={() => fetchAndCheckOffers(true)}
          disabled={loading}
          className="p-2 text-text-muted hover:text-primary transition-colors active:scale-95 rounded-full hover:bg-surface-soft cursor-pointer"
          title="Refresh offers"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Login Alert if no verified mobile */}
      {!isPhoneReady && (
        <div className="bg-warning-light border border-warning/30 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare size={16} className="text-warning" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-bold text-text-primary">
              Mobile Number Required to Avail Offers
            </h3>
            <p className="text-text-secondary text-[11px] mt-1 mb-3 leading-relaxed">
              Discounts can only be availed with a verified mobile number. Enter your number to unlock instant table savings.
            </p>
            <button
              type="button"
              onClick={() => openOffersModal("offers")}
              className="text-xs font-bold text-white bg-warning hover:opacity-90 px-4 py-2 rounded-xl active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Enter / Verify Mobile
            </button>
          </div>
        </div>
      )}

      {/* Current Spend Context */}
      <div className="bg-surface rounded-2xl p-3.5 border border-border-light flex items-center justify-between text-xs text-text-secondary shadow-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <Gift size={15} className="text-primary" />
          Current Table Order Value:
        </span>
        <span className="font-bold text-text-primary text-sm">
          ₹{tableSpend}
        </span>
      </div>

      {/* Loading state */}
      {loading && offers.length === 0 && (
        <div className="p-12 text-center text-text-muted text-sm flex items-center justify-center gap-2">
          <RefreshCw size={16} className="animate-spin text-primary" />
          Evaluating best offers...
        </div>
      )}

      {/* Empty State when restaurant admin didn't add any offer */}
      {!loading && offers.length === 0 && (
        <div className="p-10 text-center bg-surface rounded-2xl border border-border-light space-y-2">
          <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center mx-auto text-text-muted">
            <Tag size={20} />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No Active Offers Currently</h3>
          <p className="text-xs text-text-muted max-w-xs mx-auto">
            This restaurant hasn't listed any promotional offers right now. Check back soon for fresh deals!
          </p>
        </div>
      )}

      {/* Best Offer & Comparison Section */}
      {bestOffer && (
        <div className="bg-gradient-to-br from-amber-500/10 via-primary/5 to-surface rounded-2xl p-4 border border-amber-500/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/90 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-300/40">
              <Sparkles size={12} className="text-amber-600" />
              Best Offer Available
            </span>
            {bestOffer.potentialDiscount > 0 && (
              <span className="text-xs font-black text-primary bg-surface px-2.5 py-0.5 rounded-lg border border-primary/20 shadow-xs">
                Save ₹{bestOffer.potentialDiscount}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base font-extrabold text-text-primary">
              {bestOffer.name} ({bestOffer.discountText})
            </h3>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {bestOffer.terms || "Maximum savings offer calculated for your meal."}
            </p>
          </div>

          {/* Avail Best Offer Button */}
          <div className="pt-1">
            {isCurrentOfferApplied(bestOffer) ? (
              <div className="w-full bg-success-light text-primary font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 border border-primary/20">
                <CheckCircle size={15} />
                Best Offer Applied to Order
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleAvailOffer(bestOffer)}
                className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Avail Best Offer Now</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Offer Comparison Toggle */}
          {offers.length > 1 && (
            <div className="pt-2 border-t border-border-light/60">
              <button
                type="button"
                onClick={() => setShowComparison(!showComparison)}
                className="w-full flex items-center justify-between text-xs font-bold text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <span>Compare All {offers.length} Offers</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showComparison ? "rotate-180" : ""}`}
                />
              </button>

              {showComparison && (
                <div className="mt-3 space-y-2">
                  {offers.map((offer) => {
                    const isBest = offer.name === bestOffer.name;
                    const applied = isCurrentOfferApplied(offer);

                    return (
                      <div
                        key={offer.id || offer._id || offer.name}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                          applied
                            ? "bg-primary/10 border-primary"
                            : isBest
                            ? "bg-amber-500/5 border-amber-300/40"
                            : "bg-surface border-border-light"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-text-primary truncate">
                              {offer.name}
                            </span>
                            {isBest && (
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded">
                                Best
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-text-muted truncate">
                            {offer.discountText} · {offer.terms || "Standard terms"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-primary">
                            -₹{offer.potentialDiscount || 0}
                          </span>
                          {applied ? (
                            <span className="text-[10px] font-bold text-primary bg-primary/20 px-2 py-1 rounded-md">
                              Applied
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAvailOffer(offer)}
                              className="text-[10px] font-bold text-white bg-primary hover:bg-primary-hover px-2.5 py-1 rounded-md active:scale-95 transition-all cursor-pointer"
                            >
                              Avail
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Detailed Offers List */}
      {offers.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            All Available Promotions
          </h3>

          {offers.map((offer) => {
            const Icon = getIconForType(offer.type);
            const applied = isCurrentOfferApplied(offer);
            const isEligible = offer.isEligible || isPhoneReady;

            return (
              <div
                key={offer.id || offer._id || offer.name}
                className={`bg-surface rounded-2xl p-4 border shadow-xs transition-all ${
                  applied
                    ? "border-primary bg-primary/5"
                    : isEligible
                    ? "border-border-light hover:border-primary/40"
                    : "border-border-light opacity-80"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                      applied
                        ? "bg-primary text-white"
                        : "bg-surface-soft text-text-primary"
                    }`}
                  >
                    <Tag size={11} />
                    {offer.discountText}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      applied ? "bg-primary text-white" : "bg-surface-soft text-text-muted"
                    }`}
                  >
                    <Icon size={13} />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-text-primary mb-0.5">
                  {offer.name}
                </h4>
                <p className="text-text-muted text-xs mb-3 leading-relaxed">
                  {offer.terms || "Special promotional offer applied to eligible orders."}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border-light/60">
                  <span className="text-xs font-bold text-text-secondary">
                    Potential Savings:{" "}
                    <span className="text-primary font-black">₹{offer.potentialDiscount || 0}</span>
                  </span>

                  {applied ? (
                    <span className="text-xs font-bold text-primary bg-primary/15 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                      <CheckCircle size={13} />
                      Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAvailOffer(offer)}
                      className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-3.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      Avail Offer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OffersRewards;
