import React from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import AllItems from "../components/AllItems";
import FloatingCartBar from "../components/FloatingCartBar";

export default function Menu() {
  return (
    <div className="px-4 pt-4 pb-32 space-y-5">
      <SearchBar />
      <MenuCategories />
      <AllItems />
      <FloatingCartBar />
    </div>
  );
}