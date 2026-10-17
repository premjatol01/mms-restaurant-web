"use client";

import React, { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import ComboSection from "../components/ComboSection";
import TopCategoriesItems from "../components/TopCategoriesItems";
import FloatingCartBar from "../components/FloatingCartBar";
import { useMenuOrder } from "@/store/menuOrderStore";

export default function Menu() {
  const { selectedCategoryId } = useMenuOrder();

  const handleCategoryScroll = (catId) => {
    const el = document.getElementById(`category-section-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (selectedCategoryId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`category-section-${selectedCategoryId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedCategoryId]);

  return (
    <div className="px-4 pt-4 pb-32 space-y-6">
      <SearchBar />
      <MenuCategories onCategoryClick={handleCategoryScroll} />
      <ComboSection />
      <TopCategoriesItems />
      <FloatingCartBar />
    </div>
  );
}