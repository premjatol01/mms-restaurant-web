"use client";

import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";

// Inline Instagram SVG icon
function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function FollowCampaignBanner() {
  const { verifiedRestaurant } = useMenuOrder();

  const campaign = verifiedRestaurant?.portalSettings?.followCampaign;
  const socialInstagram = verifiedRestaurant?.socialLinks?.instagram;

  if (!campaign || campaign.enabled === false) return null;

  const title = campaign.bannerTitle || "Follow & Win on Instagram!";
  const subtitle =
    campaign.bannerSubtitle ||
    "Follow our official Instagram handle & show your server to claim your reward!";
  const handle = campaign.instagramHandle || (socialInstagram && socialInstagram.includes("instagram.com/") ? `@${socialInstagram.split("instagram.com/")[1]?.split(/[\/?#]/)[0]}` : "@restaurant");
  const url = campaign.instagramUrl || socialInstagram || (handle.startsWith("@") ? `https://instagram.com/${handle.replace("@", "")}` : "https://instagram.com");

  const handleOpenInstagram = () => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-3.5 text-white shadow-sm">
      {/* Decorative ambient pattern */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-yellow-300/20 blur-lg pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
            <InstagramIcon size={18} className="text-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 px-1.5 py-0.5 rounded text-white">
                Table Reward
              </span>
              <span className="text-[11px] font-semibold opacity-90 truncate">
                {handle}
              </span>
            </div>

            <h4 className="text-xs font-bold leading-snug mt-1 truncate">
              {title}
            </h4>

            <p className="text-[10px] opacity-90 leading-tight mt-0.5 line-clamp-2">
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenInstagram}
          className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl bg-white text-pink-600 hover:bg-white/90 active:scale-95 text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <span>Follow</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}

