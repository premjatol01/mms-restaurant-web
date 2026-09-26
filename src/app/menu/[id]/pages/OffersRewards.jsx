"use client";

import React from "react";
import {
  Tag,
  CheckCircle,
  MessageSquare,
  History,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";

const OffersRewards = () => {
  const { mobile, subtotal, activeOrder, orderHistory, openOffersModal } = useMenuOrder();

  const tableSpend = (activeOrder?.total ?? 0) + subtotal;
  
  // Mock logic for conditions based on requirements
  const hasQualifyingPastOrder = orderHistory.length > 0 && orderHistory.some(o => o.total >= 1000);
  const isTuesday = new Date().getDay() === 2; // 0=Sun, 1=Mon, 2=Tue

  const OFFERS = [
    {
      id: "repeat_order",
      name: "Repeat Order Offer",
      discountText: "10% OFF",
      description: "Get 10% off when you re-order within 7 days of a past order above ₹1,000.",
      icon: History,
      isEligible: mobile.verified && hasQualifyingPastOrder,
      eligibilityText: hasQualifyingPastOrder 
        ? "You qualify for this offer!" 
        : "Requires a previous order over ₹1,000 in the last 7 days."
    },
    {
      id: "order_value",
      name: "Value-Based Offer",
      discountText: "15% OFF",
      description: "Get 15% off on your entire bill when your order value reaches ₹1,500.",
      icon: TrendingUp,
      isEligible: mobile.verified && tableSpend >= 1500,
      eligibilityText: tableSpend >= 1500 
        ? "Eligible based on your current cart value!" 
        : `Add ₹${1500 - tableSpend} more to qualify.`
    },
    {
      id: "low_traffic",
      name: "Tuesday Special",
      discountText: "20% OFF",
      description: "Get 20% off on all orders above ₹1,000 placed on Tuesdays.",
      icon: Calendar,
      isEligible: mobile.verified && isTuesday && tableSpend >= 1000,
      eligibilityText: isTuesday 
        ? (tableSpend >= 1000 ? "Eligible for Tuesday Special!" : `Add ₹${1000 - tableSpend} more to qualify.`)
        : "Valid only on Tuesdays."
    }
  ];

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader
        title="Offers & Rewards"
        subtitle="Automatically applied at checkout"
        showBack={false}
      />

      {/* Login Alert */}
      {!mobile.verified && (
        <div className="bg-warning-light border border-warning/30 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare size={16} className="text-warning" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm font-bold text-text-primary">
              Action Required
            </h3>
            <p className="text-text-secondary text-[11px] mt-1 mb-3 leading-relaxed">
              Please verify your mobile number to avail exclusive offers and discounts on your order.
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

      {/* Offers List */}
      <div className="space-y-4">
        {OFFERS.map((offer) => {
          const Icon = offer.icon;
          const eligible = offer.isEligible;
          
          return (
            <div 
              key={offer.id} 
              className={`bg-surface rounded-2xl p-5 border shadow-sm transition-colors ${
                eligible ? "border-primary bg-success-light/20" : "border-border-light"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  eligible ? "bg-primary/10 text-primary" : "bg-surface-soft text-text-muted"
                }`}>
                  <Tag size={11} />
                  {offer.discountText}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  eligible ? "bg-primary text-white" : "bg-surface-soft text-text-muted"
                }`}>
                  <Icon size={14} />
                </div>
              </div>

              <h2 className="text-base font-bold text-text-primary mb-1">
                {offer.name}
              </h2>
              <p className="text-text-muted text-xs mb-4 leading-relaxed">
                {offer.description}
              </p>

              {eligible ? (
                <div className="bg-success-light border border-primary-light/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-sm">
                      Offer unlocked
                    </h4>
                    <p className="text-primary/70 text-[11px] mt-0.5">
                      Automatically applied
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-soft rounded-xl p-3">
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {!mobile.verified
                      ? "Verify your mobile number to unlock this offer."
                      : offer.eligibilityText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OffersRewards;