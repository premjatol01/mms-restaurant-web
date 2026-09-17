"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMenuOrder } from "@/context/Menuordercontext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import TableSession from "./pages/TableSession";
import OffersRewards from "./pages/OffersRewards";
import Rating from "./pages/Rating";
import UnlockOffersModal from "./modals/UnlockOffersModal";
import MyFavorites from "./pages/MyFavorites";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const { activeTab } = useMenuOrder();
  // const tableId = searchParams.get("table"); // Use this if needed

  return (
    <div>
      {activeTab === "Home" ? (
        <Home />
      ) : activeTab === "Menu" ? (
        <Menu />
      ) : activeTab === "Offers" ? (
        <OffersRewards />
      ) : activeTab === "Table" ? (
        <TableSession />
      ) : activeTab === "Rating" ? (
        <Rating />
      ) : activeTab === "Favorites" ? (
        <MyFavorites />
      ) : activeTab === "Cart" ? (
        <Cart />
      ) : activeTab === "History" ? (
        <OrderHistory />
      ) : (
        "Nothing to show for this tab."
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-primary">
          Loading...
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}
