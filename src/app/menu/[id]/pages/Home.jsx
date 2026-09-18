import React from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import OfferCarousel from "../components/OfferCarousel";
import FloatingCartBar from "../components/FloatingCartBar";
import PopularItems from "../components/PopularItems";
import RecentlyOrders from "../components/RecentlyOrders";

export default function Home() {
  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      <SearchBar />
      <MenuCategories />
      <OfferCarousel />
      <PopularItems />
      <RecentlyOrders />
      {/* Floating summary bar sits above the footer, outside normal flow */}
      <FloatingCartBar />
    </div>
  );
}
