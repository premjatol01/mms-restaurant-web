"use client";

import React from "react";
import {
  ChevronRight,
  Tag,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import PageHeader from "@/components/menuComp/PageHeader";
import { motion } from "framer-motion";

const WELCOME_THRESHOLD = 1000;
const NEXT_TIER_THRESHOLD = 2000;

const OffersRewards = () => {
  const { mobile, subtotal, activeOrder, openOffersModal } = useMenuOrder();

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

      {/* Login Banner */}
      {!mobile.verified && (
        <button
          type="button"
          onClick={openOffersModal}
          className="w-full bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-sm">
                Login to unlock offers
              </h3>
              <p className="text-white/70 text-[11px] mt-0.5">
                Verify mobile to apply discounts
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/80" />
        </button>
      )}

      {/* Welcome Offer */}
      <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center gap-1.5 bg-warning/10 text-warning text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
            <Tag size={11} />
            WELCOME10
          </span>
          <div className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center">
            <Sparkles size={14} className="text-primary" />
          </div>
        </div>

        <h2 className="text-base font-bold text-text-primary mb-1">
          10% off your first order
        </h2>
        <p className="text-text-muted text-xs mb-4 leading-relaxed">
          Valid on orders above ₹{WELCOME_THRESHOLD.toLocaleString("en-IN")}.
          Verify your mobile to apply at checkout.
        </p>

        {welcomeUnlocked ? (
          <div className="bg-success-light border border-primary-light/30 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <CheckCircle size={16} className="text-text-on-primary" />
            </div>
            <div>
              <h4 className="text-primary font-bold text-sm">
                Offer unlocked
              </h4>
              <p className="text-primary/70 text-[11px] mt-0.5">
                Applied on the Cart tab
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-surface-soft rounded-xl p-3">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {!mobile.verified
                ? "Verify your mobile number to unlock this offer."
                : `Add ₹${WELCOME_THRESHOLD - tableSpend} more to unlock.`}
            </p>
          </div>
        )}
      </div>

      {/* Next Tier Progress */}
      <div className="bg-surface rounded-2xl p-5 border border-border-light shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
            <Trophy size={11} />
            Next unlock
          </span>
          <span className="text-primary font-bold text-sm">15% OFF</span>
        </div>

        {remainingForNextTier > 0 ? (
          <>
            <h2 className="text-base font-bold text-text-primary mb-1">
              Add ₹{remainingForNextTier} more
            </h2>
            <p className="text-text-muted text-xs mb-4 leading-relaxed">
              Reach ₹{NEXT_TIER_THRESHOLD.toLocaleString("en-IN")} in this
              table session.
            </p>
          </>
        ) : (
          <h2 className="text-base font-bold text-primary mb-4">
            15% off is unlocked for this table 🎉
          </h2>
        )}

        <div className="w-full bg-surface-soft rounded-full h-2.5 mb-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${nextTierProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary to-primary-hover h-full rounded-full"
          />
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-sm">
            <span className="font-extrabold text-text-primary">
              ₹{tableSpend}
            </span>
            <span className="text-text-muted">
              {" "}
              / ₹{NEXT_TIER_THRESHOLD.toLocaleString("en-IN")}
            </span>
          </p>
          <span className="text-[11px] font-semibold text-text-muted">
            {Math.round(nextTierProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default OffersRewards;