"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMenuOrder, useMenuOrderStore } from "@/store/menuOrderStore";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import TableSession from "./pages/TableSession";
import OffersRewards from "./pages/OffersRewards";
import Rating from "./pages/Rating";
import MyFavorites from "./pages/MyFavorites";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import AllCategories from "./pages/AllCategories";

const TABS = {
  Home,
  Menu,
  Offers: OffersRewards,
  Table: TableSession,
  Rating,
  Favorites: MyFavorites,
  Cart,
  History: OrderHistory,
  Categories: AllCategories,
};

function MenuPageContent() {
  const searchParams = useSearchParams();
  const { activeTab, setActiveTab } = useMenuOrder();

  // URL → Store only. Runs on mount and when the browser URL changes
  // (e.g. user hits Back/Forward, or the Footer pushes a new URL).
  // We do NOT have a Store → URL effect here — that direction is handled
  // directly inside Footer (and any other nav element) by calling
  // router.push at the same time as setActiveTab, so there is no loop.
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (!tabParam) return;
    const matchedTab = Object.keys(TABS).find(
      (t) => t.toLowerCase() === tabParam.toLowerCase()
    );
    // Read directly from store to avoid reactivity loop
    const currentTab = useMenuOrderStore.getState().activeTab;
    if (matchedTab && matchedTab !== currentTab) {
      setActiveTab(matchedTab);
    }
  }, [searchParams, setActiveTab]);

  const ActiveComponent = TABS[activeTab] ?? Home;
  return <ActiveComponent />;
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-primary text-sm font-medium">
          Loading...
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
