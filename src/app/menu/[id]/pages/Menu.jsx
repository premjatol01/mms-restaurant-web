import React from "react";
import SearchBar from "../components/SearchBar";
import MenuCategories from "../components/MenuCategories";
import AllItems from "../components/AllItems";

export default function Menu() {
  return (
    <div className="pb-24 pt-4 px-4">
      <SearchBar />
      {/*  Section */}
      <MenuCategories />
      {/* Placeholder for menu items below (to show scroll) */}
      <AllItems />
    </div>
  );
}
