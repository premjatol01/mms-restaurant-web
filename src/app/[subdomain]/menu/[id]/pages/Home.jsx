"use client";

import React from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import AllItems from "../components/AllItems";
import OfferCarousel from "../components/OfferCarousel";
import FloatingCartBar from "../components/FloatingCartBar";
import PopularItems from "../components/PopularItems";
import RecentlyOrders from "../components/RecentlyOrders";
import ComboSection from "../components/ComboSection";
import GuestWifiCard from "../components/GuestWifiCard";
import FollowCampaignBanner from "../components/FollowCampaignBanner";
import { Bell, Gamepad2, Sparkles, ChevronRight } from "lucide-react";
import { useMenuOrder } from "@/store/menuOrderStore";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Home() {
  const { openWaiterModal, setActiveTab, verifiedRestaurant } = useMenuOrder();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const portalSettings = verifiedRestaurant?.portalSettings;
  const waiterEnabled = portalSettings?.waiterRequest?.enabled !== false;
  const gamesEnabled = portalSettings?.operations?.enableGames !== false;
  const floatingCartEnabled = portalSettings?.operations?.enableFloatingCart !== false;

  const handleOpenGames = () => {
    setActiveTab("Games");
    if (pathname) {
      const newParams = new URLSearchParams(searchParams?.toString() || "");
      newParams.set("tab", "games");
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  };

  const hasQuickServices = waiterEnabled || gamesEnabled;

  return (
    <div className="px-4 pt-4 pb-32 space-y-5">
      {/* 1. Offers Carousel & Promos */}
      <OfferCarousel />

      {/* 2. "Follow & Win" Table Campaign Banner */}
      <FollowCampaignBanner />

      {/* 3. Search Bar */}
      <SearchBar />

      {/* 4. Guest Wi-Fi Sharing Card */}
      <GuestWifiCard />

      {/* 5. Quick Services & Gaming Shortcuts */}
      {hasQuickServices && (
        <div className={`grid gap-3 ${waiterEnabled && gamesEnabled ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Request Waiter Card */}
          {waiterEnabled && (
            <button
              type="button"
              onClick={openWaiterModal}
              className="bg-surface rounded-2xl p-3.5 border border-border-light shadow-xs flex items-center gap-3 text-left hover:border-primary/40 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Bell size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                  Call Waiter
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5 truncate">
                  Service to table
                </p>
              </div>
            </button>
          )}

          {/* Game Button */}
          {gamesEnabled && (
            <button
              type="button"
              onClick={handleOpenGames}
              className="bg-surface rounded-2xl p-3.5 border border-border-light shadow-xs flex items-center gap-3 text-left hover:border-purple-400/50 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Gamepad2 size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h3 className="text-xs font-bold text-text-primary leading-tight group-hover:text-purple-600 transition-colors">
                    Play Games
                  </h3>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5 truncate">
                  Fun while you wait
                </p>
              </div>
            </button>
          )}
        </div>
      )}

      {/* 6. Top Menu Categories */}
      <MenuCategories />

      {/* 7. Menu Items Grid */}
      <AllItems />

      {/* 8. Combos Section */}
      <ComboSection />

      {/* 9. Best Selling / Popular Dishes */}
      <PopularItems />

      {/* 10. Recently Ordered */}
      <RecentlyOrders />

      {/* 11. Floating Bottom Cart Bar */}
      {floatingCartEnabled && <FloatingCartBar />}
    </div>
  );
}
