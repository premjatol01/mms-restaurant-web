import React from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import OfferCarousel from "../components/OfferCarousel";
import FloatingCartBar from "../components/FloatingCartBar";
import PopularItems from "../components/PopularItems";
import RecentlyOrders from "../components/RecentlyOrders";

export default function Home() {
  return (
    <div className="px-4 pt-4 pb-32 space-y-6">
      <SearchBar />
      <MenuCategories />
      <OfferCarousel />
      <PopularItems />
      <RecentlyOrders />
      <FloatingCartBar />
    </div>
  );
}