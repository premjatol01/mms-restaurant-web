"use client";

import { Suspense } from "react";
import { useMenuOrder } from "@/store/menuOrderStore";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import TableSession from "./pages/TableSession";
import OffersRewards from "./pages/OffersRewards";
import Rating from "./pages/Rating";
import MyFavorites from "./pages/MyFavorites";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";

const TABS = {
  Home,
  Menu,
  Offers: OffersRewards,
  Table: TableSession,
  Rating,
  Favorites: MyFavorites,
  Cart,
  History: OrderHistory,
};

function MenuPageContent() {
  const { activeTab } = useMenuOrder();
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
