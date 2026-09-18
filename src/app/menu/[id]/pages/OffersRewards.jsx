"use client";

import React from "react";
import { ChevronRight, Tag, CheckCircle, MessageSquare } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";

const WELCOME_THRESHOLD = 1000;
const NEXT_TIER_THRESHOLD = 2000;

const OffersRewards = () => {
  const { mobile, subtotal, activeOrder, openOffersModal } = useMenuOrder();

  // Table-session spend: whatever's already placed plus whatever's still
  // sitting in the cart, since both count toward unlocking offers.
  const tableSpend = (activeOrder?.total ?? 0) + subtotal;

  const welcomeUnlocked = mobile.verified && tableSpend >= WELCOME_THRESHOLD;
  const remainingForNextTier = Math.max(NEXT_TIER_THRESHOLD - tableSpend, 0);
  const nextTierProgress = Math.min(
    (tableSpend / NEXT_TIER_THRESHOLD) * 100,
    100
  );

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      <PageHeader
        title="Offers & Rewards"
        subtitle="Checked automatically against your order"
        showBack={false}
      />

      {/* Login to Unlock Banner */}
      {!mobile.verified && (
        <button
          type="button"
          onClick={openOffersModal}
          className="w-full bg-success-light border border-primary-light/30 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-success-light/70 transition-colors text-left"
        >
          <div className="flex items-center">
            <div className="bg-surface rounded-full p-2 mr-3 shadow-sm border border-border-light">
              <MessageSquare size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-primary font-semibold text-sm">
                Login to unlock offers
              </h3>
              <p className="text-primary/80 text-xs mt-0.5">
                Use your mobile number to apply discounts
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-primary" />
        </button>
      )}

      {/* Offer Card 1: Welcome offer */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-warning-light text-warning text-[10px] font-bold px-2 py-1 rounded">
            WELCOME10
          </span>
          <Tag size={20} className="text-text-secondary" />
        </div>

        <h2 className="text-base font-bold text-text-primary mb-1">
          10% off your first order
        </h2>
        <p className="text-text-muted text-xs mb-4">
          Valid on orders above ₹{WELCOME_THRESHOLD.toLocaleString("en-IN")}.
          Verify your mobile number to apply it at checkout.
        </p>

        {welcomeUnlocked ? (
          <div className="bg-success-light border border-primary-light/30 rounded-xl p-3 flex items-center">
            <div className="bg-primary rounded-full p-1 mr-3 flex-shrink-0">
              <CheckCircle size={16} className="text-text-on-primary" />
            </div>
            <div>
              <h4 className="text-primary font-bold text-sm">Offer unlocked</h4>
              <p className="text-primary/80 text-xs mt-0.5">
                Apply WELCOME10 on the Cart tab
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-surface-soft rounded-xl p-3 text-xs text-text-secondary">
            {!mobile.verified
              ? "Verify your mobile number to unlock this offer."
              : `Add ₹${WELCOME_THRESHOLD - tableSpend} more to unlock this offer.`}
          </div>
        )}
      </div>

      {/* Offer Card 2: Progress toward next tier */}
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border-light">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-warning-light text-warning text-[10px] font-bold px-2 py-1 rounded">
            NEXT UNLOCK
          </span>
          <span className="text-text-primary font-medium text-sm">15% OFF</span>
        </div>

        {remainingForNextTier > 0 ? (
          <>
            <h2 className="text-base font-bold text-text-primary mb-1">
              Add ₹{remainingForNextTier} more to unlock
            </h2>
            <p className="text-text-muted text-xs mb-4">
              Reach ₹{NEXT_TIER_THRESHOLD.toLocaleString("en-IN")} in this table
              session.
            </p>
          </>
        ) : (
          <h2 className="text-base font-bold text-primary mb-4">
            15% off is unlocked for this table 🎉
          </h2>
        )}

        <div className="w-full bg-surface-soft rounded-full h-2 mb-3">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${nextTierProgress}%` }}
          />
        </div>

        <p className="text-sm text-text-primary">
          <span className="font-bold">₹{tableSpend}</span>{" "}
          <span className="text-text-muted">
            / ₹{NEXT_TIER_THRESHOLD.toLocaleString("en-IN")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default OffersRewards;
