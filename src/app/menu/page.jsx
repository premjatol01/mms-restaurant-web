"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import OfferCarousel from "./components/OfferCarousel";
import FloatingCartBar from "./components/FloatingCartBar";
import SearchBar from "./components/SearchBar";
import MenuCategories from "./components/MenuCategories";
import PopularItems from "./components/PopularItems";
import { useMenuOrder } from "@/context/Menuordercontext";
import RecentlyOrders from "./components/RecentlyOrders";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const { activeTab } = useMenuOrder();
  // const tableId = searchParams.get("table"); // Use this if needed

  return (
    <>
      {activeTab === "Home" ? (
        <div className="pb-24 pt-4 px-4">
          <SearchBar />
          {/*  Section */}
          <MenuCategories />
          {/* Promo Banner */}
          <OfferCarousel />
          {/* Floating Cart Bar / Collapsed Cart Button */}
          <FloatingCartBar />
          {/* Placeholder for menu items below (to show scroll) */}
          <PopularItems />
          {/* Recently ordered */}
          <RecentlyOrders />
        </div>
      ) : activeTab === "Menu" ? (
        "menu"
      ) : activeTab === "Offers" ? (
        "Offers"
      ) : activeTab === "Table" ? (
        "Table"
      ) : (
        "Nothing to show for this tab."
      )}
    </>
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
