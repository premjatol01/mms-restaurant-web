import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import OfferCarousel from "../components/OfferCarousel";
import FloatingCartBar from "../components/FloatingCartBar";
import PopularItems from "../components/PopularItems";
import RecentlyOrders from "../components/RecentlyOrders";
import UnlockOffersModal from "../modals/UnlockOffersModal";

export default function Home() {
  const [offersModal, setOffersModal] = useState(true);
  
  return (
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

      {offersModal && (
        <UnlockOffersModal onClose={() => setOffersModal(false)} />
      )}
    </div>
  );
}
